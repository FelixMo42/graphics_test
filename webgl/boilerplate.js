/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
export const createShader = (gl, shaderSource, shaderType) => {
    // create the shader object
    var shader = gl.createShader(shaderType)
   
    // set the shader source code.
    gl.shaderSource(shader, shaderSource)
   
    // compile the shader
    gl.compileShader(shader)
   
    // check if it compiled
    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
        let info = gl.getShaderInfoLog(shader)

        // remove the shader from the context
        gl.deleteShader(shader)

        // Something went wrong during compilation get the error
        throw "could not compile shader:" + info + "\n" + shaderSource
    }
   
    return shader
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext} gl The WebGL context.
 * @param {!string} vertShader A vertex shader.
 * @param {!string} fragShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
export const createProgram = (gl, vertShader, fragShader) => {
    // create a program
    var program = gl.createProgram()

    // attach the shaders
    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)

    // link the program
    gl.linkProgram(program)

    // check if it linked
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        // something went wrong with the link
        throw ("program filed to link:" + gl.getProgramInfoLog (program))
    }

    return program
}

// export const create

export const loop = (body) => {
    let loop = () => {
        body()
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}