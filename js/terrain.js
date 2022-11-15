
import * as THREE from "./three/three.module.js";
import TerrainGeometry from "./terrainGeometry.js";
import TextureSplattingMaterial from "./TextureSplattingMaterial.js";
import Tree from "./Tree.js";
import Rock from "./rock.js";

export default class Terrain extends THREE.Object3D {
    constructor(scene, renderer, camera) {
        super();
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.terrainImage = new Image();
        this.terrain = new THREE.Object3D();
        this.size = 1200;
        this.height = 100;
        this.resolution = 128;
        this.islandNumber = Math.floor(Math.random() * 3) + 1;
        this.trees = [];
        this.treesIndex = 0;
        this.matrix = [];
        this.#generateTerrain();
        this.transform(0, -10, 0);
    }

    pos() {
        return this.terrain.position;
    }

    transform(x, y, z) {
        this.terrain.position.x += x;
        this.terrain.position.y += y;
        this.terrain.position.z += z;
    }

    async #generateTerrain() {
        console.log("Genererer terreng");
        this.terrainImage.onload = async () => { 
            const grass = new THREE.TextureLoader().load('images/grass.png');
            const rock = new THREE.TextureLoader().load('images/rock.png');
            const alphaMap = new THREE.TextureLoader().load('images/terrain' + this.islandNumber + '.png');
            grass.wrapS = THREE.RepeatWrapping;
            grass.wrapT = THREE.RepeatWrapping;
            grass.repeat.multiplyScalar(this.size / 16);
            this.geometry = new TerrainGeometry(this.size, this.resolution, this.height, this.terrainImage);
            rock.wrapS = THREE.RepeatWrapping;
            rock.wrapT = THREE.RepeatWrapping;

            rock.repeat.multiplyScalar(this.size / 16);

            const material = new TextureSplattingMaterial({
                color: THREE.Color.NAMES.white,
                colorMaps: [grass, rock],
                alphaMaps: [alphaMap],
            });
            let mesh = new THREE.Mesh(this.geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.terrain.add(mesh);
            this.terrain.add(new THREE.BoxHelper(mesh));
            this.scene.add(this.terrain);
            console.log("generer trær");
            await this.#addThrees(this.geometry.data);
            console.log("generer Steiner");
            await this.#addRocks(this.geometry.data);
            this.renderer.shadowMap.needsUpdate = true;
            //const box = new THREE.BoxHelper(mesh, 0xffff00);
            //this.terrain.add(box);
        }
        this.terrainImage.src = 'images/terrain' + this.islandNumber + '.png' ;
        
    }

    generateHeatMap(inverse){
        let heat = [];
        for(let i = 0; i < this.geometry.attributes.uv.count; i++){
            let val = this.data[i];
        if(inverse) {
            val = Math.pow(1 - val, 10);
        } else {
            val = Math.pow(val, 10);
        }
            heat.push(val);
            this.geometry.setAttribute("heat", new THREE.Float32BufferAttribute(heat, 1));
        }
        //this.geometry.setAttribute("heat", new THREE.Float32BufferAttribute(heat, 1));
    }

    #addRocks(terrainData) {
        return new Promise((resolve) => {
            this.data = terrainData;
            this.generateHeatMap(false);
            const rock = new Rock(this.scene, 50, this.geometry, this.terrain.position, resolve);
        });
        
    }

    #addThrees(terrainData) {
        return new Promise((resolve) => {
            this.data = terrainData;
            this.generateHeatMap(true);
            this.trees[this.treesIndex] = new Tree(this.scene, 250, this.geometry, this.terrain.position, resolve);
            this.treesIndex++;
        });
    }
    animate() {
        this.clock = new THREE.Clock();
        let deltaTime = this.clock.getDelta();
        for(let i = 0; i < this.trees.length; i++) {
            this.trees[i].animate(deltaTime);
        }
    }
}