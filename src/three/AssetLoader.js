import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
    }

    loadModel(url, onProgress) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (gltf) => {
                    const model = gltf.scene;

                    // Enable shadows
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });

                    this.scene.add(model);
                    resolve(model);
                },
                (xhr) => {
                    if (xhr.lengthComputable && onProgress) {
                        const percent = xhr.loaded / xhr.total;
                        onProgress(percent);
                    }
                },
                (error) => {
                    console.error('An error happened loading ' + url, error);
                    reject(error);
                }
            );
        });
    }
}
