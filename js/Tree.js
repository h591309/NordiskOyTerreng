import { GLTFLoader } from './three/GLTFLoader.js';
import * as THREE from './three/three.module.js';
import {MeshSurfaceSampler} from './three/MeshSurfaceSampler.js';

export default class Tree {
    constructor(scene, size, amount, geometry, position) {
        const loader = new GLTFLoader();
        loader.load( '../3dmodels/basicThree2.glb', function ( gltf ) {
            gltf.scene.children[0].scale.set(size,size,size);
            gltf.scene.traverse(function(child) {
                const trees = new THREE.InstancedMesh(child.geometry, child.material, amount);
                scene.add(trees);
                
                /**
                 * 
                 */
                 const sampler = new MeshSurfaceSampler( geometry ).setWeightAttribute( 'color' ).build();
                 
                 const tempPosition = new THREE.Vector3();
                 const tempObject = new THREE.Object3D();
                 
                   
                 for (let i = 0; i < 300; i++) {
                     sampler.sample(tempPosition);
                     if(tempPosition.y + position.y < 0 || tempPosition.y + position.y > 80){
                        
                     } else {
                        tempObject.position.set(tempPosition.x + position.x, tempPosition.y + position.y, tempPosition.z + position.z);
                        tempObject.scale.setScalar(Math.random() * 0.5 + 0.5);
                        tempObject.updateMatrix();
                        trees.setMatrixAt(i, tempObject.matrix);
                     }
                 }
                /**
                 * 
                 */

            });
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }

    animate() {

    }

    setMatrixAt(i, matrix) {
        this.child.setMatrixAt(i, matrix);
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