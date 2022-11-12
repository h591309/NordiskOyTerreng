import { GLTFLoader } from './three/GLTFLoader.js';
import * as THREE from './three/three.module.js';
import Constants from "../json/constants.json" assert {type: 'json'};
import {placeObjectOnTerrain} from "./utils.js";

export default class Tree {
    constructor(scene, amount, geometry, position, resolve) {
        const size = Constants.tree.size;
        const loader = new GLTFLoader();
        loader.load( '../3dmodels/Tree.glb', function ( gltf ) {
            const child = gltf.scene.children[0];
            console.log(child.material);
            child.material = new THREE.MeshPhongMaterial({
                color: 0x29A14D
            });
            gltf.scene.children[0].scale.set(size,size,size);
            const trees = new THREE.InstancedMesh(child.geometry, child.material, amount);
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