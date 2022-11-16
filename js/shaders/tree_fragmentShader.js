
const fragmentShader = `

#define STANDARD
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
#ifdef USE_IRIDESCENCE
  uniform float iridescence;
  uniform float iridescenceIOR;
  uniform float iridescenceThicknessMinimum;
  uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
    uniform vec3 sheenColor;
    uniform float sheenRoughness;
    #ifdef USE_SHEENCOLORMAP
        uniform sampler2D sheenColorMap;
    #endif
    #ifdef USE_SHEENROUGHNESSMAP
        uniform sampler2D sheenRoughnessMap;
    #endif
#endif

varying vec3 vViewPosition;

varying float yPos;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float shininess;

#include <common>
#include <packing>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <normal_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

    vec3 colorLeaves = vec3(0.098,0.361,0.192);
    vec3 colorStem = vec3(0.251,0.188,0.153);

    #include <clipping_planes_fragment>
    vec4 diffuseColor = vec4( diffuse, 1.0 );
    if(yPos < 1.0) {
        vec4 diffuseColor = vec4(vec3(0.639,0.463,0.373), 1.0 );
    }
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    #include <logdepthbuf_fragment>
    #include <color_fragment>
    vec3 totalEmissiveRadiance = emissive;
    #include <roughnessmap_fragment>
    #include <metalnessmap_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>
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
    

    #ifdef OPAQUE
        diffuseColor.a = 1.0;
    #endif
    #ifdef USE_TRANSMISSION
        diffuseColor.a *= material.transmissionAlpha + 0.1;
    #endif

    gl_FragColor = vec4(mix(colorStem, outgoingLight, 0.5), diffuseColor.a);
    if(yPos > 1.0) {
        gl_FragColor.rgb = vec3(mix(colorLeaves, outgoingLight, 0.5));
    }
    


    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>

}
`;

export default fragmentShader;