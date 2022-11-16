"use strict";

import * as THREE from "./three/three.module.js";
import Islands from "./islands.js";
import CameraController from "./cameraControls.js";
import Environment from "./environment.js";
import { VRButton } from "./three/VRButton.js";

const numberOfIslands = 5;
const vrCamTarget = {
    x: 0,
    y: 100,
    z: 0,
};

let camToNumber = 0;
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
    antialias: true,
});

const xr = renderer.xr;

xr.enabled = true;

document.body.appendChild(VRButton.createButton(renderer));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;



const white = new THREE.Color(THREE.Color.NAMES.white);

renderer.setClearColor(white, 1.0);
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x91584d, 0.0007);
let ambient = new THREE.AmbientLight(0xd95a43, 0.1);
ambient.castShadow = false;
scene.add(ambient);
let animateScene = false;
let animationSpeed = 0.5;
let introScene = false;
let introSpeed = 0.01;


let user = new THREE.Group();
const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 10000);
camera.lookAt(0, 0, 0);
xr.addEventListener("sessionstart", () => {
    user.position.set(0, 500 ,0);
    user.rotateY(3.14159);
    user.add( camera );
    user.updateMatrix();
    scene.add(user);
    introScene = true;
});


let env = new Environment(scene, camera, renderer);
env.animate();


const oceanFloorGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
const oceanFloorMat = new THREE.MeshPhongMaterial({
    color: 0x15242b,
    side: THREE.DoubleSide,
    depthWrite: true
});

const oceanFloorMesh = new THREE.Mesh(oceanFloorGeo, oceanFloorMat);
oceanFloorMesh.position.set(0, -12, 0);
oceanFloorMesh.rotateX(1.5708);
scene.add(oceanFloorMesh);


const islands = new Islands(scene, renderer, camera, numberOfIslands);
const firstIslandPos = islands.getFirstIslandPos();

const controller = new CameraController(camera, renderer.domElement);
controller.setTarget(new THREE.Vector3(firstIslandPos.x, 10, firstIslandPos.z));
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

function moveCamIntro(target) {
    let y;
    let moveY;
    y = Math.max(user.position.y, target.y) - Math.min(user.position.y, target.y);
    if(user.position.y > target.y) {
        moveY = Math.min(introSpeed, y)
        user.position.y -= moveY;
    } else if(user.position.y < target.y) {
        moveY = Math.min( introSpeed, y)
        user.position.y += moveY;
    }
    if(introSpeed < 5) {
        introSpeed += 0.2;
    }
    if(user.position.y < 350){
        introSpeed *= 0.99;
    }
    if(user.position.y < 150){
        introSpeed *= 0.8;
    }
    if(user.position.y < 110){
        introSpeed *= 0.7;
    }
}

function moveCameraTo(position) {
    let x, z;
    let moveX, moveZ;
    x = Math.max(user.position.x, position.x) - Math.min(user.position.x, position.x);
    if(user.position.x > position.x) {
        moveX = Math.min(animationSpeed, x)
        user.position.x -= moveX;
    } else if(user.position.x < position.x) {
        moveX = Math.min( animationSpeed, x )
        user.position.x += moveX;
    }

    z = Math.max(user.position.z, position.z) - Math.min(user.position.z, position.z);
    if(user.position.z > position.z) {
        moveZ = Math.min( animationSpeed, z );
        user.position.z -= moveZ;
    } else if (user.position.z < position.z) {
        moveZ = Math.min( animationSpeed, z );
        user.position.z += moveZ;
    }
}


function render() {
    env.animate();
    islands.animate();
    if(xr.getSession() == null) {
        updateRendererSize();
    }
    if(introScene) {
        moveCamIntro(vrCamTarget);
        if(user.position.y == vrCamTarget.y) {
            introScene = false;
            animateScene = true;
        }
    }
    if(animateScene) {
        if(camToNumber > numberOfIslands - 1) {
            camToNumber = 0;
        }
        moveCameraTo(islands.islands[camToNumber].terrain.position);
        if(islands.islands[camToNumber].terrain.position.x == user.position.x && islands.islands[camToNumber].terrain.position.z == user.position.z) {
            camToNumber++;
        }
    }
    renderer.render(scene, camera);
    controller.update();
}