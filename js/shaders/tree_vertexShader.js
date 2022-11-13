const vertexShader = `

#define STANDARD
varying vec3 vViewPosition;
varying vec3 vNormal;

varying float yPos;
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
#include <clipping_planes_pars_vertex>


void main () {

    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <begin_vertex>
    #include <displacementmap_vertex>
    #include <project_vertex>
    #include <clipping_planes_vertex>
    vViewPosition = - mvPosition.xyz;
    #include <worldpos_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>
    vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
    yPos = position.y;
}
`;

export default vertexShader;