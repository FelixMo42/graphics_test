#version 300 es

precision highp float;

// the texture
uniform sampler2D u_texture;

// passed in from the vertex shader
// in vec2 v_texcoord;

// the output color of this spot
out vec4 outColor;

void main() {
    outColor = vec4(
        0.60392156863,
        0.59607843137,
        0.39607843137,
    1);
    //texture(u_texture, v_texcoord);
}