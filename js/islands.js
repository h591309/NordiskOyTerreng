"use strict";

import Terrain from "./terrain.js"
import Water from "./water.js";
import {Vector2, Vector3} from "./three/three.module.js";
import Constants from "../json/constants.json" assert {type: 'json'};

export default class Islands {
    constructor(scene, camera, numberOfIslands) {
        this.islands = [];
        this.waterTiles = [];
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
        for(let i = 0; i < this.numberOfIslands*2; i++) { // x
            for(let j = 0; j < this.numberOfIslands*2; j++) { // y
                let posX = Constants.size*i;
                let posY = Constants.size*j;
                if(i == Math.floor(Math.random() * 10) && numberOfIslandsleft > 0) {
                    numberOfIslandsleft--;
                    this.islands[counter] = new Terrain(this.scene, this.camera);
                    this.islands[counter].transform(posX , 0, posY);
                    counter++;
                   // console.log("Island - Pos x: " + posX + " Pos y: " + posY);
                } else {
                    this.waterTiles[counter2] = new Water(this.scene, this.camera);
                    this.waterTiles[counter2].transform(posX , 0, posY);
                    counter2++;
                    //console.log("Water - Pos x: " + posX + " Pos y: " + posY);
                }
                
            }
        }
        if(numberOfIslandsleft > 0) {
            this.numberOfIslands = this.numberOfIslands - numberOfIslandsleft;
        }
    }

    generateWater() {
      
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