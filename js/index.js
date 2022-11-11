"use strict";

import * as THREE from "./three/three.module.js";
import Islands from "./islands.js";
import CameraController from "./cameraControls.js";
import Environment from "./environment.js";

const numberOfIslands = 10;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
    antialias: true,
});

const white = new THREE.Color(THREE.Color.NAMES.white);

renderer.setClearColor(white, 1.0);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 10000);
camera.lookAt(0, 0, 0);
scene.add(camera);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Water

const islands = new Islands(scene, camera, numberOfIslands);
const avgIslandPos = islands.getFirstIslandPos();

const controller = new CameraController(camera, renderer.domElement);
controller.setTarget(new THREE.Vector3(avgIslandPos.x, 10, avgIslandPos.z));
avgIslandPos.y = 50;
controller.update();
let env = new Environment(scene, renderer);
env.animate();

console.log("Done setting up everything!");

function updateRendererSize() {
    const { x: currentWidth, y: currentHeight } = renderer.getSize(
        new THREE.Vector2()
    );

    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;

    if (width !== currentWidth || height !== currentHeight) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    
}

animate();

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    env.animate();
    updateRendererSize();
    renderer.render(scene, camera);
    controller.update();
}

//renderer.setAnimationLoop(animate);