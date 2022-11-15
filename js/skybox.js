"use strict";
import { Sky } from './three/Sky.js';

export default class Skybox {
    constructor(scene, camera) {
        this.sky = new Sky(camera);
        this.sky.scale.setScalar( 10000 );
        this.scene = scene;
        this.scene.add(this.sky);

        this.skyUniforms = this.sky.material.uniforms;
        this.skyUniforms[ 'turbidity' ].value = 10;
        this.skyUniforms[ 'rayleigh' ].value = 2;
        this.skyUniforms[ 'mieCoefficient' ].value = 0.005;
        this.skyUniforms[ 'mieDirectionalG' ].value = 0.8;
    }
}