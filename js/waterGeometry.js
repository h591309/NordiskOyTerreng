import { PlaneGeometry } from "./three/three.module.js";


export default class WaterGeometry extends PlaneGeometry {
    constructor(size, resolution) {
        super(size, size, resolution - 1, resolution - 1);

        this.rotateX((Math.PI / 180) * -90);
        
    }
}