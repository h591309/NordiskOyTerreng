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

            /* UniformsLib.common,
			UniformsLib.specularmap,
			UniformsLib.envmap,
			UniformsLib.aomap,
			UniformsLib.lightmap,
			UniformsLib.emissivemap,
			UniformsLib.bumpmap,
			UniformsLib.normalmap,
			UniformsLib.displacementmap,
			UniformsLib.fog,
			UniformsLib.lights,
			{
				emissive: { value: new Color( 0x000000 ) },
				specular: { value: new Color( 0x111111 ) },
				shininess: { value: 30 }
			}
            */
        let material = new THREE.ShaderMaterial({
            defines: {
                USE_UV: ""
            },
            uniforms: THREE.UniformsUtils.merge( [
                THREE.ShaderLib.standard.uniforms,

                {
                    diffuse: {value: new THREE.Color(0x91584d)},
                    emissive: {value: new THREE.Color(0x000000)},
                    roughness: { value: 1.0 },
                    metalness: { value: 0.0 },
                    shininess: { value: 30 },
                },
            ]),
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            fog: true,
            lights: true,
        });

        loader.load( './js/3dmodels/Tree.glb', function ( gltf ) {
            const child = gltf.scene.children[0];
            child.scale.set(size,size,size);
            //material = child.material;
            child.name = "tree";
            let trees = new THREE.InstancedMesh(child.geometry, material, amount);
            trees.castShadow = true;
            trees.receiveShadow = true;
            scene.add(trees);
            placeObjectOnTerrain(position, geometry, trees, amount);
            trees.updateMatrixWorld();
            trees.updateMatrix();
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