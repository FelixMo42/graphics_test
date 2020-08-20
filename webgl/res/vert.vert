#version 300 es

// the size of the screen
uniform vec2 screenResolution;
uniform vec4 spriteShape;

// an attribute is an input (in) to a vertex shader
in vec4 vertexPosition;

// a varying to pass the texture coordinates to the fragment shader
// out vec2 v_texcoord;

void main() {
    // set the location of the vertex in 3d space
    gl_Position = vertexPosition;

    // pass the texcoord to the fragment shader.
    // v_texcoord = vertexPosition;
}