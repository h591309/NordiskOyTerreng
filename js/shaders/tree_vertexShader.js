const vertexShader = `



varying float yPos;

#include <fog_pars_vertex>

void main () {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
    yPos = position.y;
}
`;

export default vertexShader;