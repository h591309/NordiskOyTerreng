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
        let counter = 0;
        let counter2 = 0;
        let numberOfIslandsleft = this.numberOfIslands;
        for(let i = 0; i < this.numberOfIslands; i++) { // y
            let posX = Constants.size * Math.random() * 10;
            let posY = Constants.size * Math.random() * 10;
            this.islands[i] = new Terrain(this.scene, this.camera);
            this.islands[i].transform(posX , -0.5, posY);
        }
    }

    getAveragePos() {
        let maxX = Constants.size*this.numberOfIslands*2;
        let maxY = Constants.size*this.numberOfIslands*2;

        let avgPos = {
            x: maxX/2,
            y: 0,
            z: maxY/2
        }
        return avgPos;
    }
}