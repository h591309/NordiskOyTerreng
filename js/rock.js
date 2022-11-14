import { GLTFLoader } from './three/GLTFLoader.js';
import * as THREE from './three/three.module.js';
import {placeObjectOnTerrain} from "./utils.js";

export default class Rock {
    constructor(scene, amount, geometry, position, resolve) {
        const size = 10;
        const loader = new GLTFLoader();
        loader.load( '../3dmodels/rock.glb', function ( gltf ) {
            gltf.scene.children[0].scale.set(size,size,size);
            gltf.scene.traverse(function(child) {
                const rocks = new THREE.InstancedMesh(child.geometry, child.material, amount);
                rocks.castShadow = true;
                scene.add(rocks);
                
                placeObjectOnTerrain(position, geometry, rocks, amount);
                resolve(true);
            });
        }, undefined, function ( error ) {
            console.error( error );
        } );
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