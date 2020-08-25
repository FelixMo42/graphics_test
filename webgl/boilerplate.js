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

export const createVertexArray = (gl, program, name, spriteCount) => {
    // get the location of the vertex attrabure in the programe
    let attributeLocation = gl.getAttribLocation(program, name)

    // create a buffer
    let buffer = gl.createBuffer()

    // make sure were using the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    // create a buffer to store the attribure values
    let data = new Float32Array(spriteCount * 4 * 2)
    
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

    return { vao , data }
}

export function createQuadIndexArray(gl, sprites) {
    let numIndexs = sprites * 6

    // create the index buffer
    const indexBuffer = gl.createBuffer()
    
    // make this buffer the current 'ELEMENT_ARRAY_BUFFER'
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

    let indexs = new Uint16Array(numIndexs)

    for (let i = 0, c = 0; c < numIndexs; c += 6, i += 4) {
        indexs[c + 0] = i + 0
        indexs[c + 1] = i + 1
        indexs[c + 2] = i + 2
        indexs[c + 3] = i + 2
        indexs[c + 4] = i + 1
        indexs[c + 5] = i + 3
    }
        
    // fill the current element array buffer with data
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexs, gl.STATIC_DRAW)
}