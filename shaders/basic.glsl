#StartVertex
precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;

varying vec3 v_Color;

void main() {
    v_Color = vertColor;
    gl_Position = vec4(vertPosition, 1.0);
}

#StartFragment
precision mediump float;

varying vec3 v_Color;

void main() {
    gl_FragColor = vec4(v_Color, 1.0);
}