"use strict";

import { GLTFLoader } from './three/GLTFLoader.js';
import * as THREE from './three/three.module.js';
import {placeObjectOnTerrain} from "./utils.js";
import vShader from "./shaders/tree_vertexShader.js";
import fShader from "./shaders/tree_fragmentShader.js";

export default class Tree {
    constructor(scene, amount, geometry, position, resolve) {
        const size = 100;
        const loader = new GLTFLoader();

        const vertexShader = vShader

        const fragmentShader = fShader
        this.time = 0;
        this.trees = new THREE.Object3D();

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge( [
                THREE.ShaderLib.standard.uniforms,

                {
                    diffuse: {value: new THREE.Color(0x91584d)},
                    emissive: {value: new THREE.Color(0x000000)},
                    roughness: { value: 1.0 },
                    metalness: { value: 0.0 },
                    shininess: { value: 30 },
                    time: {type: "f", value: this.time},
                },
            ]),
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            fog: true,
            lights: true,
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

    animate(deltaTime) {
        //this.material.uniforms.time.value += 0.01*deltaTime;
        this.material.uniforms.time.value += 0.01;
        this.trees.updateMatrix();
    }
}