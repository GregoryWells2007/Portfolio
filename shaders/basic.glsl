#StartVertex
precision mediump float;

attribute vec3 vertPosition;
attribute vec2 texCoord;
attribute vec3 normalPosition;

uniform mat4 translationMatrix;
uniform mat4 viewMatrix;
uniform mat4 cameraMatrix;

uniform vec3 lightPosition;

varying vec3 v_Normal;
varying vec3 v_toLightVector;
varying vec2 v_TexCooord;

void main() {
    v_TexCooord = texCoord;

    vec4 worldPosition = translationMatrix * vec4(vertPosition, 1.0);

    v_Normal = (translationMatrix * vec4(normalPosition, 1.0)).xyz;
    v_toLightVector = lightPosition - worldPosition.xyz;

    gl_Position = cameraMatrix * viewMatrix * worldPosition;
}

#StartFragment
precision mediump float;

varying vec3 v_Normal;
varying vec3 v_toLightVector;
varying vec2 v_TexCooord;

uniform vec3 modelColor;
uniform vec3 lightColor;

uniform sampler2D sampler;

void main() {

    vec3 unitNormal = normalize(v_Normal);
    vec3 unitLightVector = normalize(v_toLightVector);
    float nDot1 = dot(unitNormal, unitLightVector);
    float brightness = max(nDot1, 0.2);
    vec3 diffuse = vec3(brightness) * lightColor;

    gl_FragColor = vec4(modelColor, 1.0) * vec4(diffuse, 1.0);
}