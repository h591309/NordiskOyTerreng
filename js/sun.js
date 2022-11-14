"use strict";

import * as THREE from "./three/three.module.js";

export default class Sun {
    constructor(scene, renderer, ocean, skybox) {
        this.sun = new THREE.Vector3();
        this.sunLight = new THREE.DirectionalLight(0xd95a43, 2.5, 1000);
        const d = 1000;

        this.sunLight.shadow.camera.left = - d;
        this.sunLight.shadow.camera.right = d;
        this.sunLight.shadow.camera.top = d;
        this.sunLight.shadow.camera.bottom = - d;
        this.sunLight.target.position.set(this.sunLight.getWorldDirection(new THREE.Vector3( 0.70707, 0.70707, 0.0 )));

        this.sunLight.castShadow = true;
        this.sunLight.position.y = 500;
        this.sunLight.position.z = -2000;

        this.elevation = 0.2;
        this.azimuth = 180;
        this.scene = scene;
        this.scene.add(this.sunLight);
        this.renderTarget;
        this.pmremGenerator = new THREE.PMREMGenerator(renderer);
        this.ocean = ocean;
        this.skybox = skybox;
        const cameraHelper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        scene.add(cameraHelper);
        console.log(this.sunLight);
        this.sunLight.shadow.mapSize.width = 1000;
        this.sunLight.shadow.mapSize.height = 1000;
        this.sunLight.shadow.camera.near = 0.1;
        this.sunLight.shadow.camera.far = 6000;
    }

    updateSun() {
        const phi = THREE.MathUtils.degToRad( 90 - this.elevation );
        const theta = THREE.MathUtils.degToRad( this.azimuth );
    
        this.sun.setFromSphericalCoords( 1, phi, theta );
        this.skybox.sky.material.uniforms[ 'sunPosition' ].value.copy( this.sun );
        this.ocean.water.material.uniforms[ 'sunDirection' ].value.copy( this.sun ).normalize();
        if ( this.renderTarget !== undefined ) this.renderTarget.dispose();
    
        this.renderTarget = this.pmremGenerator.fromScene( this.skybox.sky );
    
        this.scene.environment = this.renderTarget.texture1;
    }
}