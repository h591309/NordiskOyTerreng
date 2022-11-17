"use strict";

import Terrain from "./terrain.js"

export default class Islands {
    constructor(scene, renderer, camera, numberOfIslands) {
        this.islands = [];
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.numberOfIslands = numberOfIslands;
        this.generate();
    }
    
    generate() {
        for(let i = 0; i < this.numberOfIslands; i++) { // y
            let posX = Math.random() * 3000 - (1500);
            let posY = Math.random() * 3000 - (1500);
            this.islands[i] = new Terrain(this.scene, this.renderer, this.camera);
            this.islands[i].transform(posX , -0.5, posY);
        }
    }

    getFirstIslandPos() {
        let avgPos = {
            x: this.islands[0].terrain.position.x,
            y: 0,
            z: this.islands[0].terrain.position.z
        }
        return avgPos;
    }
    animate() {
        for(let i = 0; i < this.islands.length; i++){
            this.islands[i].animate();
        }
    }
}