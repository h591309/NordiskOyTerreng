"use strict";

import * as THREE from "./three/three.module.js";
import Islands from "./islands.js";
import CameraController from "./cameraControls.js";

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
    antialias: true,
});

const white = new THREE.Color(THREE.Color.NAMES.white);
const red = new THREE.Color(THREE.Color.NAMES.red);

renderer.setClearColor(white, 1.0);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 5000);

camera.lookAt(0, 0, 0);

scene.add(camera);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const sun = new THREE.DirectionalLight(0xedcaab, 1.0);
scene.add(sun);

const islands = new Islands(scene, camera, 3);
const avgIslandPos = islands.getAveragePos();

const controller = new CameraController(camera, renderer.domElement);
controller.setTarget(new THREE.Vector3(avgIslandPos.x, avgIslandPos.y, avgIslandPos.z));
avgIslandPos.y = 100;
controller.update();

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

function loop() {
    updateRendererSize();
    renderer.render(scene, camera);
    controller.update();
}

renderer.setAnimationLoop(loop);