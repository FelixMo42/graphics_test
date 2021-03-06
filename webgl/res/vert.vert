#version 300 es

// an attribute is an input (in) to a vertex shader
in vec2 vertexPosition;

// the size of the screen
uniform vec2 cameraPosition;
uniform vec2 screenResolution;

// a varying to pass the texture coordinates to the fragment shader
// out vec2 v_texcoord;

void main() {
    // set the location of the vertex in 3d space
    gl_Position = vec4((vertexPosition + cameraPosition) / screenResolution, 0, 1);

    // pass the texcoord to the fragment shader.
    // v_texcoord = vertexPosition;
}