const vertexShader = `
varying float yPos;
void main () {
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
    yPos = position.y;
}
`;

export default vertexShader;