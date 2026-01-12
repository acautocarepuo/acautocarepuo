import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class CameraRig {
    constructor(domElement) {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.controls = new OrbitControls(this.camera, domElement);

        // Initial setup
        this.camera.position.set(4, 2, 6);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        this.controls.target.set(0, 0.5, 0);

        // Animation state
        this.isTransitioning = false;
        this.targetPos = new THREE.Vector3();
        this.targetLook = new THREE.Vector3();
        this.transitionCallback = null;

        // Defined Views
        this.views = {
            exterior: {
                pos: new THREE.Vector3(4, 2, 6),
                target: new THREE.Vector3(0, 0.5, 0)
            },
            engine: {
                pos: new THREE.Vector3(1.5, 2, 0), // Closer/High angle
                target: new THREE.Vector3(0, 0.8, 0)
            }
        };
    }

    transitionTo(viewName, onComplete) {
        const view = this.views[viewName];
        if (!view) return;

        this.targetPos.copy(view.pos);
        this.targetLook.copy(view.target);
        this.isTransitioning = true;
        this.transitionCallback = onComplete;

        // Disable controls during cinematic transition
        this.controls.enabled = false;
    }

    update(delta) {
        if (this.isTransitioning) {
            // Lerp Position
            this.camera.position.lerp(this.targetPos, 2 * delta);

            // Lerp Target (Controls target)
            this.controls.target.lerp(this.targetLook, 2 * delta);

            // Check if close enough
            if (this.camera.position.distanceTo(this.targetPos) < 0.1) {
                this.isTransitioning = false;
                this.controls.enabled = true;
                if (this.transitionCallback) {
                    this.transitionCallback();
                    this.transitionCallback = null;
                }
            }
        }

        this.controls.update();
    }
}
