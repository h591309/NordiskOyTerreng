import {
	Camera
} from './three/three.module.js';

import { OrbitControls } from './three/OrbitControls.js';

export default class CameraController {
    /**
     * 
     * @param {Camera} camera 
     * @param {Object} domElement 
     */
    constructor(camera, domElement) {
        this.camera = camera;

        this.lastUpdate = 0;
        this.controls = new OrbitControls( camera, domElement );
        this.controls.listenToKeyEvents( window ); // optional

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.controls.screenSpacePanning = false;

        this.controls.minDistance = 50;
        this.controls.maxDistance = 2000;

        this.controls.maxPolarAngle = Math.PI / 2;

        
        
    }
    setPosition(pos) {
        this.camera.position.set(pos.x, pos.y, pos.z);
    }

    setTarget(target) {
        this.controls.target = target;
    }

    update() {

        this.controls.update();
        
    }
}