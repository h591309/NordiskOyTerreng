//Kun brukt for higlight av tekst.

#define STANDARD
varying vec3 vViewPosition;
uniform float time;

varying float yPos;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main () {
    
    float displacement = sin(position.x * time);
    if(position.y < 1.0) {
        displacement = 1.0;
    }

    vec3 newPosition = vec3(position + displacement * 0.20);

    #include <uv_vertex>
    #include <uv2_vertex>
    #include <color_vertex>
    #include <morphcolor_vertex>
    #include <beginnormal_vertex>
    #include <morphnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>
    #include <normal_vertex>
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <displacementmap_vertex>
    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    vViewPosition = - mvPosition.xyz;
    #include <worldpos_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>

    //gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position , 1.0 );
    //if(mod(position.y, position.x) > 1.0) {

        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( newPosition , 1.0 );
    
    yPos = position.y;
}