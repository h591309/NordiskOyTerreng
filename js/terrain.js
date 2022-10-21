
import * as THREE from "./three/three.module.js";
import TerrainGeometry from "./terrainGeometry.js";
import Constants from "../json/constants.json" assert {type: 'json'};
import TextureSplattingMaterial from "./TextureSplattingMaterial.js";

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

        this.#generateTerrain();
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
            const alphaMap = new THREE.TextureLoader().load('images/terrain.png');
            
            const geometry = new TerrainGeometry(this.size, this.resolution, this.height, this.terrainImage);
            grass.wrapS = THREE.RepeatWrapping;
            grass.wrapT = THREE.RepeatWrapping;

            grass.repeat.multiplyScalar(this.size / 4);
            
            rock.wrapS = THREE.RepeatWrapping;
            rock.wrapT = THREE.RepeatWrapping;

            rock.repeat.multiplyScalar(this.size / 4);

            const material = new TextureSplattingMaterial({
                color: THREE.Color.NAMES.white,
                colorMaps: [grass, rock],
                alphaMaps: [alphaMap]
            });

            const mesh = new THREE.Mesh(geometry, material);
            this.terrain.add(mesh);
            this.scene.add(this.terrain);

            const box = new THREE.BoxHelper(mesh, 0xffff00);
            this.terrain.add(box);
        }
        this.terrainImage.src = 'images/terrain.png';
    }
}