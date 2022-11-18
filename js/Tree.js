"use strict";

import { GLTFLoader } from './three/GLTFLoader.js';
import * as THREE from './three/three.module.js';
import {placeObjectOnTerrain} from "./utils.js";
import TreeMaterial from './TreeMaterial.js';

export default class Tree extends THREE.Object3D {

    /**
     * 
     * @param {THREE.Scene} scene 
     * @param {number} amount 
     * @param {THREE.Geometry} geometry 
     * @param {THREE.Object3D.position} position 
     * @param {resolve} resolve 
     */
    constructor(scene, amount, geometry, position, resolve) {
        super();
        const size = 100;
        const loader = new GLTFLoader();

        this.trees = new THREE.Object3D();

        this.material = new TreeMaterial({
            color: 0x91584d,
            emissive: 0x000000,
            shininess: 1.0,
            metalness: 0.5,
            roughness: 5.0,
        });

        loader.load( './js/3dmodels/Tree.glb', ( gltf ) => {
            const child = gltf.scene.children[0];
            child.scale.set(size,size,size);
            //material = child.material;
            child.name = "tree";
            this.trees = new THREE.InstancedMesh(child.geometry, this.material, amount);
            this.trees.castShadow = true;
            this.trees.receiveShadow = true;
            scene.add(this.trees);
            placeObjectOnTerrain(position, geometry, this.trees, amount);
            this.trees.updateMatrixWorld();
            this.trees.updateMatrix();
            resolve("done");
        });
            
    }

    animate() {
        //this.material.uniforms.time.value += 0.01*deltaTime;
        this.material.uniforms.time.value += 0.01;
        this.trees.updateMatrix();
    }
}