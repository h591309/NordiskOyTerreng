"use strict";

import {MeshSurfaceSampler} from './three/MeshSurfaceSampler.js';
import * as THREE from "./three/three.module.js";

export function getHeightmapData(image, size) {
    const canvas = document.createElement("canvas");
  
    // Assume the image is square:
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.drawImage(image, 0, 0, size, size);

    const imageData = context.getImageData(0, 0, size, size).data;

    const data = new Float32Array(size * size);
    for (let i = 0; i < imageData.length; i += 4) {
      data[i / 4] = imageData[i] / 255;
    }
    return data;
}

export function placeObjectOnTerrain(terrainPosition, geometry, instancedMesh, amount) {
    const sampler = new MeshSurfaceSampler( geometry ).setWeightAttribute('heat').build();
                  
    const tempPosition = new THREE.Vector3();
    const tempObject = new THREE.Object3D();

    for (let i = 0; i < amount; i++) {
        sampler.sample(tempPosition);
        if(tempPosition.y + terrainPosition.y < 5 || tempPosition.y + terrainPosition.y > 60){
          i--;
        } else {
          tempObject.position.set(tempPosition.x + terrainPosition.x, tempPosition.y + terrainPosition.y+1, tempPosition.z + terrainPosition.z);
          tempObject.scale.setScalar(Math.random() * 0.5 + 1);
          tempObject.updateMatrix();
          instancedMesh.setMatrixAt(i, tempObject.matrix);
        }
    }
}