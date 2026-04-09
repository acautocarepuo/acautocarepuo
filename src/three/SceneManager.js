import * as THREE from 'three';
import { CameraRig } from './CameraRig.js';
import { AssetLoader } from './AssetLoader.js';

export class SceneManager {
    constructor(canvasContainer) {
        this.container = canvasContainer;
        this.scene = null;
        this.renderer = null;
        this.cameraRig = null;
        this.assetLoader = null;
        this.clock = new THREE.Clock();

        this.models = {
            car: null
        };

        this.state = {
            currentView: 'exterior',
            isLoading: true
        };

        // Callbacks for UI
        this.onTransitionStart = null;
        this.onTransitionEnd = null;

        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f7); // Apple-like light grey
        this.scene.fog = new THREE.FogExp2(0xf5f5f7, 0.02);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);

        // Sub-modules
        this.cameraRig = new CameraRig(this.renderer.domElement);
        this.assetLoader = new AssetLoader(this.scene);

        // Lighting
        this.setupLighting();

        // Ground
        this.setupGround();

        // Event Listeners
        window.addEventListener('resize', this.onResize.bind(this));

        // Start Loop
        this.render();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 7.5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);

        // Rim lights for cinematic look
        const spotLight = new THREE.SpotLight(0x00d2ff, 5);
        spotLight.position.set(-5, 0, 5);
        spotLight.lookAt(0, 0, 0);
        this.scene.add(spotLight);
    }

    setupGround() {
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,  // White ground
                depthWrite: false,
                roughness: 0.8,
                metalness: 0.2
            })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);

        // Lighter grid
        const grid = new THREE.GridHelper(100, 40, 0xcccccc, 0xe5e5e5);
        grid.material.opacity = 0.5;
        grid.material.transparent = true;
        this.scene.add(grid);
    }

    async loadAssets(onProgress) {
        try {
            // Load Car
            this.models.car = await this.assetLoader.loadModel(
                '/ASSETS/3D%20Model/PROTON%20X50.glb',
                (p) => onProgress('Loading Car...', p * 0.5)
            );

            // Adjust Car
            if (this.models.car) {
                this.models.car.scale.setScalar(1);
                // Auto-center might be needed depending on model origin
            }

            this.state.isLoading = false;

        } catch (error) {
            console.error("Critical error loading assets:", error);
            throw error;
        }
    }

    switchToExteriorView() {
        if (this.state.currentView === 'exterior') return;

        if (this.onTransitionStart) this.onTransitionStart();

        this.cameraRig.transitionTo('exterior', () => {
            this.fadeModelIn(this.models.car);

            if (this.onTransitionEnd) this.onTransitionEnd();
        });

        this.state.currentView = 'exterior';
    }

    fadeModelOut(model) {
        if (!model) return;
        // Simple visibility toggle for MVP, can upgrade to opacity fade if materials support it
        model.visible = false;
    }

    fadeModelIn(model) {
        if (!model) return;
        model.visible = true;
    }

    onResize() {
        if (!this.renderer || !this.cameraRig) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.cameraRig.camera.aspect = width / height;
        this.cameraRig.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    render() {
        requestAnimationFrame(this.render.bind(this));

        const delta = this.clock.getDelta();

        if (this.cameraRig) this.cameraRig.update(delta);

        if (this.renderer && this.scene && this.cameraRig) {
            this.renderer.render(this.scene, this.cameraRig.camera);
        }
    }
}
