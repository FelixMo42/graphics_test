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

export const fetchShader = (gl, shaderUrl, shaderType) =>
    fetch(shaderUrl)
        .then(response => response.text())
        .then(shaderSource => createShader(gl, shaderSource, shaderType))

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

export const resizeCanvas = (canvas) => {
    // lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth
    var displayHeight = canvas.clientHeight

    // check if the canvas is not the same size.
    if (canvas.width  !== displayWidth || canvas.height !== displayHeight) {
        canvas.width  = displayWidth
        canvas.height = displayHeight
    }
}

export const loop = (body) => {
    let loop = () => {
        body()
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}

export const createVertexArray = (gl, program, name) => {
    const spriteCount = 1

    // get the location of the vertex attrabure in the programe
    let attributeLocation = gl.getAttribLocation(program, name)

    // create a buffer
    let buffer = gl.createBuffer()

    // make sure were using the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    
    let data = new Float32Array(spriteCount * 4 * 2)

    data[0] = 0
    data[1] = 0

    data[2] = 0
    data[3] = 0.5

    data[4] = 0.5
    data[5] = 0

    data[6] = 0.5
    data[7] = 0.5
    
    // set the data in the buffer
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)

    // create a vertex array object (attribute state)
    let vao = gl.createVertexArray()
    
    // make sure were using the vertex array
    gl.bindVertexArray(vao)

    // link the vertex array to the desired attraibue 
    gl.enableVertexAttribArray(attributeLocation)

    let size = 2          // 2 components per iteration
    let type = gl.FLOAT   // the data is 32bit floats
    let normalize = false // don't normalize the data
    let stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0        // start at the beginning of the buffer
    gl.vertexAttribPointer(attributeLocation, size, type, normalize, stride, offset)

    return vao
}

export function createQuadIndexArray(gl) {
    // create the index buffer
    const indexBuffer = gl.createBuffer()
    
    // make this buffer the current 'ELEMENT_ARRAY_BUFFER'
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        
    // fill the current element array buffer with data
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([
            0, 1, 2,   // first triangle
            2, 1, 3,   // second triangle
        ]),
        gl.STATIC_DRAW
    )
}