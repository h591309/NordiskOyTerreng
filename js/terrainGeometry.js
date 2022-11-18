"use strict";

import {PlaneGeometry} from "./three/three.module.js";
import {getHeightmapData} from "./utils.js";

export default class TerrainGeometry extends PlaneGeometry {

    /**
     * 
     * @param {number} size 
     * @param {number} resolution 
     * @param {number} height 
     * @param {THREE.Texture} image 
     */
    constructor(size, resolution, height, image) {
        super(size, size, resolution - 1, resolution - 1);
        this.rotateX((Math.PI / 180) * -90);
        this.polygonOffset = true;
        this.polygonOffsetUnits = 0.01;
        this.data = getHeightmapData(image, resolution);


        for (let i = 0; i < this.data.length; i++) {
            this.attributes.position.setY(i, this.data[i] * height);
        }
    }
}