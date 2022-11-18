"use strict";

import * as THREE from "./three/three.module.js";
import Islands from "./islands.js";
import CameraController from "./cameraControls.js";
import Environment from "./environment.js";
import { VRButton } from "./three/VRButton.js";

export default class IslandMap {
    /**
    *   @param {number} numberOfIslands
    */
    constructor(numberOfIslands) {
    this.numberOfIslands = numberOfIslands;
    this.vrCamTarget = {
        x: 0,
        y: 100,
        z: 0,
    };

    this.camToNumber = 0;
    this.renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("canvas"),
        antialias: true,
    });

    this.xr = this.renderer.xr;

    this.xr.enabled = true;

    document.body.appendChild(VRButton.createButton(this.renderer));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    this.renderer.setClearColor(0xffffff, 1.0);
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x91584d, 0.0007);
    this.animatescene = false;
    this.animationSpeed = 0.5;
    this.introScene = false;
    this.introSpeed = 0.01;


    this.user = new THREE.Group();
    this.camera = new THREE.PerspectiveCamera(90, 1, 0.1, 10000);
    this.camera.lookAt(0, 0, 0);
    this.xr.addEventListener("sessionstart", () => {
        this.user.position.set(0, 500 ,0);
        this.user.rotateY(3.14159);
        this.user.add( this.camera );
        this.user.updateMatrix();
        this.scene.add(this.user);
        this.introScene = true;
    });


    this.env = new Environment(this.scene, this.camera, this.renderer);
    this.env.animate();


    this.islands = new Islands(this.scene, this.renderer, this.camera, this.numberOfIslands);
    const firstIslandPos = this.islands.getFirstIslandPos();

    this.controller = new CameraController(this.camera, this.renderer.domElement);
    this.controller.setTarget(new THREE.Vector3(firstIslandPos.x, 10, firstIslandPos.z));
    this.controller.update();
    this.animate();
    }

    /**
     * Update canvas width and height to match window size.
     */
    #updateRendererSize() {
        const { x: currentWidth, y: currentHeight } = this.renderer.getSize(
            new THREE.Vector2()
        );

        const width = this.renderer.domElement.clientWidth;
        const height = this.renderer.domElement.clientHeight;

        if (width !== currentWidth || height !== currentHeight) {
            this.renderer.setSize(width, height, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    /**
     * Animate scene.
     */
    animate() {
        //requestAnimationFrame( animate );             // For non vr
        this.renderer.setAnimationLoop(this.render.bind(this)); // For vr
        this.render();
    }

    #moveCamIntro(target) {
        let y;
        let moveY;
        y = Math.max(this.user.position.y, target.y) - Math.min(this.user.position.y, target.y);
        if(this.user.position.y > target.y) {
            moveY = Math.min(this.introSpeed, y)
            this.user.position.y -= moveY;
        } else if(this.user.position.y < target.y) {
            moveY = Math.min( this.introSpeed, y)
            this.user.position.y += moveY;
        }
        if(this.introSpeed < 5) {
            this.introSpeed += 0.2;
        }
        if(this.user.position.y < 350){
            this.introSpeed *= 0.99;
        }
        if(this.user.position.y < 150){
            this.introSpeed *= 0.8;
        }
        if(this.user.position.y < 110){
            this.introSpeed *= 0.7;
        }
    }

    #moveCameraTo(position) {
        let x, z;
        let moveX, moveZ;
        x = Math.max(this.user.position.x, position.x) - Math.min(this.user.position.x, position.x);
        if(this.user.position.x > position.x) {
            moveX = Math.min(this.animationSpeed, x)
            this.user.position.x -= moveX;
        } else if(this.user.position.x < position.x) {
            moveX = Math.min( this.animationSpeed, x )
            this.user.position.x += moveX;
        }

        z = Math.max(this.user.position.z, position.z) - Math.min(this.user.position.z, position.z);
        if(this.user.position.z > position.z) {
            moveZ = Math.min( this.animationSpeed, z );
            this.user.position.z -= moveZ;
        } else if (this.user.position.z < position.z) {
            moveZ = Math.min( this.animationSpeed, z );
            this.user.position.z += moveZ;
        }
    }


    render() {
        this.env.animate();
        this.islands.animate();
        if(this.xr.getSession() == null) {
            this.#updateRendererSize();
        }
        if(this.introScene) {
            this.#moveCamIntro(this.vrCamTarget);
            if(this.user.position.y == this.vrCamTarget.y) {
                this.introScene = false;
                this.animatescene = true;
            }
        }
        if(this.animatescene) {
            if(this.camToNumber > this.numberOfIslands - 1) {
                this.camToNumber = 0;
            }
            this.#moveCameraTo(this.islands.islands[this.camToNumber].terrain.position);
            if(this.islands.islands[this.camToNumber].terrain.position.x == this.user.position.x && this.islands.islands[this.camToNumber].terrain.position.z == this.user.position.z) {
                this.camToNumber++;
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.controller.update();

        }
}