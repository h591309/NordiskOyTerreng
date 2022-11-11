
import * as THREE from "./three/three.module.js";
import TerrainGeometry from "./terrainGeometry.js";
import Constants from "../json/constants.json" assert {type: 'json'};
import TextureSplattingMaterial from "./TextureSplattingMaterial.js";
import Tree from "./Tree.js";
import {MeshSurfaceSampler} from './three/MeshSurfaceSampler.js';

export default class Terrain extends THREE.Object3D {
    constructor(scene, camera) {
        super();
        this.scene = scene;
        this.camera = camera;
        this.terrainImage = new Image();
        this.terrain = new THREE.Object3D();
        this.size = Constants.size;
        this.height = Constants.height;
        this.resolution = Constants.resolution;
        this.islandNumber = Math.floor(Math.random() * 3) + 1;
        this.treePositions = [];
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

    #generateTerrain() {
        
        this.terrainImage.onload = () => { 
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
                alphaMaps: [alphaMap]
            });
            const mesh = new THREE.Mesh(this.geometry, material);
            this.terrain.add(mesh);
            this.scene.add(this.terrain);
            this.#addThrees(this.geometry.data);
            //const box = new THREE.BoxHelper(mesh, 0xffff00);
            //this.terrain.add(box);
        }
        this.terrainImage.src = 'images/terrain' + this.islandNumber + '.png' ;
        
    }
    generateHeatMap(){
        let heat = [];
        for(let i = 0; i < this.geometry.attributes.uv.count; i++){
            let val = this.data[i];
            val = Math.pow(1 - val, 10);
            heat.push(val);
        }
        this.geometry.setAttribute("heat", new THREE.Float32BufferAttribute(heat, 1));
        console.log("done");
    }

    #addThrees(terrainData) {
        this.data = terrainData;
        this.generateHeatMap();
        let pos = {
            x: 0,
            y: 0,
            z: 0
        }
        let counter = 0;
        

        const tree = new Tree(this.scene, 1000, this.geometry, this.terrain.position);
        

        /*
        for(let i = 0; i < this.data.length; i+=4) {

        }
        
        for(let i = 0; i < this.data.length; i+=4) {
            let coord = this.data[i] < 0.7 && this.data[i] > 0.3;
            if(amountOfTrees > 0) {
                if(coord) {
                    this.newThree[counter] = new Tree(this.scene, 1, pos);
                    amountOfTrees--;
                    counter++;
                }
            } else {
                console.log("Done setting up trees!");
                return;
            }
        }
        */
    }
}