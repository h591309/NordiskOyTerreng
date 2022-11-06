"use strict";

import * as THREE from "./three/three.module.js";
import Islands from "./islands.js";
import CameraController from "./cameraControls.js";
import { Water } from './three/Water.js';
import { Sky } from './three/Sky.js';


const numberOfIslands = 10;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
    antialias: true,
});

let sun = new THREE.Vector3();

const white = new THREE.Color(THREE.Color.NAMES.white);

renderer.setClearColor(white, 1.0);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 5000);

camera.lookAt(0, 0, 0);

scene.add(camera);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Water
const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

let water = new Water(
waterGeometry,
{
textureWidth: 512,
textureHeight: 512,
waterNormals: new THREE.TextureLoader().load( '../images/waternormals.jpeg', function ( texture1 ) {

    texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;

} ),
sunDirection: new THREE.Vector3(),
sunColor: 0xffffff,
waterColor: 0x001e0f,
distortionScale: 3.7,
fog: scene.fog !== undefined
}
);

water.rotation.x = - Math.PI / 2;
scene.add( water );


// Skybox
const sky = new Sky();
sky.scale.setScalar( 10000 );
scene.add( sky );

const skyUniforms = sky.material.uniforms;

skyUniforms[ 'turbidity' ].value = 10;
skyUniforms[ 'rayleigh' ].value = 2;
skyUniforms[ 'mieCoefficient' ].value = 0.005;
skyUniforms[ 'mieDirectionalG' ].value = 0.8;

const parameters = {
elevation: 2,
azimuth: 180
};

const pmremGenerator = new THREE.PMREMGenerator( renderer );
let renderTarget;

const islands = new Islands(scene, camera, numberOfIslands);
const avgIslandPos = islands.getAveragePos();

const controller = new CameraController(camera, renderer.domElement);
controller.setTarget(new THREE.Vector3(avgIslandPos.x, avgIslandPos.y, avgIslandPos.z));
avgIslandPos.y = 100;
controller.update();

function updateSun() {
    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    if ( renderTarget !== undefined ) renderTarget.dispose();

    renderTarget = pmremGenerator.fromScene( sky );

    scene.environment = renderTarget.texture1;
}

const sunLight = new THREE.DirectionalLight(0xedcaab, 1.0);
scene.add(sunLight);

updateSun();

const waterUniforms = water.material.uniforms;

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
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    updateRendererSize();
    renderer.render(scene, camera);
    controller.update();
}

//renderer.setAnimationLoop(animate);