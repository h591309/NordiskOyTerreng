"use strict";
import * as THREE from "./three/three.module.js";
import vShader from "./shaders/tree_vertexShader.js";
import fShader from "./shaders/tree_fragmentShader.js";

export default class TreeMaterial extends THREE.ShaderMaterial {
  /**
   *
   * @param {Object} options
   * @param {number} options.color
   * @param {number} options.emissive
   * @param {number} options.roughness
   * @param {number} options.metalness
   */
    constructor({
        color = 0xffffff,
        emissive = 0x000000,
        shininess = 0.1,
        roughness = 1.0,
        metalness = 0.0,

    } = {}) {

        const vertexShader = vShader;
        const fragmentShader = fShader;

        let time = 0;
        // Setup our uniforms object:
        // If you want to keep the functionality of a built-in material you have to add the appropriate uniforms.
        // You can find the uniforms for built-in shaders here:
        // https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib.js
        let uniforms = THREE.UniformsUtils.merge([
        THREE.ShaderLib.standard.uniforms, {
            // custom uniforms:
            diffuse: {value: new THREE.Color(color)}, //new THREE.Color(0x91584d)},
            emissive: {value: new THREE.Color(emissive)},
            roughness: { value: roughness },
            metalness: { value: metalness },
            shininess: { value: shininess },
            time: {type: "f", value: time},
        }]);

        // Setup defines object:
        // The defines variables are usually used to enable/disable functionality in the glsl shaders.
        let defines = {
        STANDARD: "",
        };

        super({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms,
            defines,
            fog: true,
            lights: true,
        });
   }
}