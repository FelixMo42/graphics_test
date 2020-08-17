#version 300 es

// the size of the screen
uniform vec2 screenResolution;
uniform vec4 spriteShape;

// an attribute is an input (in) to a vertex shader
in vec2 vertexPosition;

// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

void main() {
    // set the location of the vertex in 3d space
    gl_Position = vec4(
        (spriteShape.x + spriteShape.z * vertexPosition.x) / screenResolution.x,
        (spriteShape.y - spriteShape.w * vertexPosition.y) / screenResolution.y,
    0, 1);

    // pass the texcoord to the fragment shader.
    v_texcoord = vertexPosition;
}