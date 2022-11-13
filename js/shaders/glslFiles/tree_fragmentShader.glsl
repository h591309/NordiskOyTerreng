
#define STANDARD

#include <fog_pars_fragment> // må kanskje flyttes

varying float yPos;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float shininess;

#include <common>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>

void main() {
    #ifdef PHYSICAL
        #define IOR
        #define SPECULAR
    #endif
    #ifdef SPECULAR
        uniform float specularIntensity;
        uniform vec3 specularColor;
        #ifdef USE_SPECULARINTENSITYMAP
            uniform sampler2D specularIntensityMap;
        #endif
        #ifdef USE_SPECULARCOLORMAP
            uniform sampler2D specularColorMap;
        #endif
    #endif

    #include <emissivemap_fragment>
    // accumulation
    #include <lights_physical_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_maps>
    #include <lights_fragment_end>
    // modulation
    #include <aomap_fragment>
    vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
    vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    #include <transmission_fragment>
    vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
    #ifdef USE_SHEEN
        // Sheen energy compensation approximation calculation can be found at the end of
        // https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
        float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
        outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
    #endif


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