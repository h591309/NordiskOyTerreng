void main() {
    in vPos;
    gl_FragColor = vec4(0.329, 0.275, 0.239, 1.0);
    if(vPos.y > 4.0) {
        gl_FragColor = vec4(0.282, 0.58, 0.404, 1.0);
    }
}