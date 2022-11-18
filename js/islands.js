"use strict";

import Terrain from "./terrain.js"

export default class Islands {

    /**
     * 
     * @param {THREE.Scene} scene 
     * @param {THREE.WebGLRenderer} renderer 
     * @param {THREE.Camera} camera 
     * @param {number} numberOfIslands 
     */
    constructor(scene, renderer, camera, numberOfIslands) {
        this.islands = [];
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.numberOfIslands = numberOfIslands;
        this.generate();
    }

    /**
     * Generate islands
     */
    generate() {
        for(let i = 0; i < this.numberOfIslands; i++) { // y
            let posX = Math.random() * 3000 - (1500);
            let posY = Math.random() * 3000 - (1500);
            this.islands[i] = new Terrain(this.scene, this.renderer, this.camera);
            this.islands[i].transform(posX , -0.5, posY);
        }
    }

    /**
     * 
     * @returns Position of first generated island.
     */
    getFirstIslandPos() {
        let pos = {
            x: this.islands[0].terrain.position.x,
            y: 0,
            z: this.islands[0].terrain.position.z
        }
        return pos;
    }

    /**
     * Animates this Class (Islands)
     */
    animate() {
        for(let i = 0; i < this.islands.length; i++){
            this.islands[i].animate();
        }
    }
}