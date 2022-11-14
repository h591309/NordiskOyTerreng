"use strict";

import * as THREE from "./three/three.module.js";
import Islands from "./islands.js";
import CameraController from "./cameraControls.js";
import Environment from "./environment.js";
import { VRButton } from "./three/VRButton.js";

const numberOfIslands = 5;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
    antialias: true,
});

//Enable VR support

renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


const white = new THREE.Color(THREE.Color.NAMES.white);

renderer.setClearColor(white, 1.0);
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x91584d, 0.001);
let ambient = new THREE.AmbientLight(0xd95a43, 0.1);
ambient.castShadow = false;
scene.add(ambient);
let user = new THREE.Group();
const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 10000);
camera.lookAt(0, 0, 0);
user.position.set(0, 0 ,0);
camera.position.y = 10;
user.add( camera );
scene.add(user);


const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);
let env = new Environment(scene, renderer);
env.animate();

const islands = new Islands(scene, renderer, camera, numberOfIslands);
const avgIslandPos = islands.getFirstIslandPos();

const controller = new CameraController(camera, renderer.domElement);
controller.setTarget(new THREE.Vector3(avgIslandPos.x, 10, avgIslandPos.z));
controller.update();

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
    //   
}
animate();

function animate() {
    //requestAnimationFrame( animate );             // For non vr
    renderer.setAnimationLoop(render.bind(this)); // For vr
    render();
}

function render() {
    env.animate();
    updateRendererSize();
    renderer.render(scene, camera);
    controller.update();
}

//renderer.setAnimationLoop(animate);