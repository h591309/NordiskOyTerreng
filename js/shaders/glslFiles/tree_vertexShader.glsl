
#define STANDARD

varying float yPos;
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>

void main () {    
    #include <begin_vertex>
    #include <displacementmap_vertex>
    #include <project_vertex>
    #include <fog_vertex>


    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
    yPos = position.y;
}

