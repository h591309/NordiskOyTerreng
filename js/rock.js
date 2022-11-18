"use strict";

import { GLTFLoader } from './three/GLTFLoader.js';
import * as THREE from './three/three.module.js';
import {placeObjectOnTerrain} from "./utils.js";

export default class Rock extends THREE.Object3D {
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
        const size = 10;
        const loader = new GLTFLoader();
        loader.load( './3dmodels/rock.glb', function ( gltf ) {
            gltf.scene.children[0].scale.set(size,size,size);
            gltf.scene.traverse(function(child) {
                const material = new THREE.MeshStandardMaterial({
                    color: 0x5c5a55,
                    roughness: 30.0,
                    metalness: 1.0,
                });
                const rocks = new THREE.InstancedMesh(child.geometry, material, amount);
                rocks.castShadow = true;
                scene.add(rocks);
                
                placeObjectOnTerrain(position, geometry, rocks, amount);
                resolve(true);
            });
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }

    /**
     * 
     * Animates this class
     */
    animate() {

    }
}