import WaterGeometry from "./waterGeometry.js";
import Constants from "../json/constants.json" assert {type: 'json'};
import * as THREE from "./three/three.module.js";

export default class Water {
    constructor(scene, camera) {
        this.size = Constants.size;
        this.resolution = Constants.resolution;
        this.height = 0;
        this.scene = scene;
        this.camera = camera;
        this.water = new THREE.Object3D();
        this.#generateWater();
    }

    transform(x, y, z) {
        this.water.position.x += x;
        this.water.position.y += y;
        this.water.position.z += z;
        console.log("Water position: " + "x: " + this.water.position.x + " y: "  + this.water.position.y + " z: " + this.water.position.z);
    }

    #generateWater() {
        const geometry = new WaterGeometry(this.size, this.resolution);
        const texture = new THREE.TextureLoader().load("../images/water.jpeg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
        const material = new THREE.MeshPhongMaterial({
            color: THREE.Color.NAMES.blue,
            map: texture
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.water.add(mesh);
        this.scene.add(this.water);


        const box = new THREE.BoxHelper(this.water, 0xcf3ea3);
        this.water.add(box);
    }
}