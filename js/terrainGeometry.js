"use strict";

import {PlaneGeometry} from "./three/three.module.js";
import {getHeightmapData} from "./utils.js";

export default class TerrainGeometry extends PlaneGeometry {
    constructor(size, resolution, height, image) {
        super(size, size, resolution - 1, resolution - 1);

        this.rotateX((Math.PI / 180) * -90);

        const data = getHeightmapData(image, resolution);

        for (let i = 0; i < data.length; i++) {
            this.attributes.position.setY(i, data[i] * height);
        }
    }
}