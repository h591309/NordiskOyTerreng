"use strict";

import Terrain from "./terrain.js"
import Constants from "../json/constants.json" assert {type: 'json'};

export default class Islands {
    constructor(scene, camera, numberOfIslands) {
        this.islands = [];
        this.scene = scene;
        this.camera = camera;
        this.numberOfIslands = numberOfIslands;
        console.log("Setting up water and islands!");
        this.generate();
        console.log("Done setting up water and islands!");
        
    }

    generate() {
        for(let i = 0; i < this.numberOfIslands; i++) { // y
            let posX = Constants.space * Math.random() * 10 - (Constants.space * 10) / 2;
            let posY = Constants.space * Math.random() * 10 - (Constants.space * 10) / 2;
            this.islands[i] = new Terrain(this.scene, this.camera);
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
}