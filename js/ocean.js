"use strict";

import * as THREE from "./three/three.module.js";
import { Water } from './three/Water.js';


export default class Ocean {
    /**
     * 
     * @param {Integer} size 
     */
    constructor(scene, size) {
        this.waterGeometry = new THREE.PlaneGeometry( size, size );
        this.scene = scene;

        this.water = new Water(
        this.waterGeometry,
        {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( './images/waternormals.jpeg', function ( texture1 ) {

            texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;

        } ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x6e3122,
        distortionScale: 3.7,
        alpha: 1,
        fog: scene.fog !== undefined
        }
        );

        this.water.rotation.x = - Math.PI / 2;
        this.scene.add(this.water);

        this.oceanFloorGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
        this.oceanFloorMat = new THREE.MeshPhongMaterial({
            color: 0x182620,
            side: THREE.DoubleSide,
            depthWrite: true
        });
    
        this.oceanFloorMesh = new THREE.Mesh(this.oceanFloorGeo, this.oceanFloorMat);
        this.oceanFloorMesh.position.set(0, -25, 0);
        this.oceanFloorMesh.rotateX(1.5708);
        this.scene.add(this.oceanFloorMesh);
    }

    /**
     * Water animations
     */
    animate() {
        this.water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    }
}