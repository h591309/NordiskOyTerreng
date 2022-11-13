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

        let material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge( [
				THREE.UniformsLib[ 'fog' ],
                {
                    diffuse: new THREE.Color(0xffffff),
                    emissive: new THREE.Color(0x000000),
                    roughness: 1.0,
                    metalness: 0.0,
                },
            ]),
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            fog: true,
        });
/* 
        const vertexShader = vShader;
        const fragmentShader = fShader;
 */
        loader.load( '../3dmodels/Tree.glb', function ( gltf ) {
            const child = gltf.scene.children[0];
            child.scale.set(size,size,size);
            //material = child.material;
            child.name = "tree";
            let trees = new THREE.InstancedMesh(child.geometry, material, amount);
            trees.castShadow = true;
            trees.receiveShadow = true;
            scene.add(trees);
            placeObjectOnTerrain(position, geometry, trees, amount);
            resolve("done");
        });
            
    }

    animate() {

    }
    

    /*
        		// model
		
		var dummy = new THREE.Object3D();

		var loader = new GLTFLoader().setPath( 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/' );
		loader.load( 'DamagedHelmet.gltf', function ( gltf ) {	

			gltf.scene.traverse( function ( child ) {

				if ( child.isMesh ) {
				
					var instancedMesh = new THREE.InstancedMesh( child.geometry, child.material, 1 );
					instancedMesh.setMatrixAt( 0, dummy.matrix );
					scene.add( instancedMesh );

				}

			} );
    */
}