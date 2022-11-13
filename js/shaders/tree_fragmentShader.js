
const fragmentShader = `

#include <fog_pars_fragment>

varying float yPos;
void main() {
    
    vec3 colorLeaves = vec3(0.286,0.749,0.361);
    vec3 colorStem = vec3(0.251,0.188,0.153);
    vec3 shadowColor = vec3(0, 0, 0);
    float shadowPower = 0.5;

    gl_FragColor = vec4(colorStem, 1.0);
    if(yPos > 1.0) {
        gl_FragColor = vec4(colorLeaves, 1.0);
    }
    #include <fog_fragment>

}
`;

export default fragmentShader;