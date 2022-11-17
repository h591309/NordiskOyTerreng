"use strict";

import Ocean from './ocean.js';
import Skydome from './Skydome.js';
import Sun from './sun.js';

export default class Environment {
    constructor(scene, camera, renderer) {
        this.ocean = new Ocean(scene, 10000);
        this.skybox = new Skydome(scene, camera);
        this.sun = new Sun(scene, renderer, this.ocean, this.skybox);
    }

    animate() {
        this.ocean.animate();
        this.sun.updateSun();
    }
}