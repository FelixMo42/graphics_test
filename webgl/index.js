"use strict"

import {
    createShader,
    createProgram,
    loop
} from "./boilerplate.js"

function createVertexArray(gl, program, name) {
    // get the location of the vertex attrabure in the programe
    let attributeLocation = gl.getAttribLocation(program, name)

    // create a buffer
    let buffer = gl.createBuffer()

    // make sure were using the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    // set the data in the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0   , 0   ,
        0   , 0.5 ,
        0.7 , 0   ,
    ]), gl.STATIC_DRAW)

    // create a vertex array object (attribute state)
    let vao = gl.createVertexArray()
    
    // make sure were using the vertex array
    gl.bindVertexArray(vao)

    gl.enableVertexAttribArray(attributeLocation)

    let size = 2          // 2 components per iteration
    let type = gl.FLOAT   // the data is 32bit floats
    let normalize = false // don't normalize the data
    let stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0        // start at the beginning of the buffer
    gl.vertexAttribPointer(attributeLocation, size, type, normalize, stride, offset)

    return vao
}

async function main() {
    // get A WebGL context
    var gl = document.querySelector("#game").getContext("webgl2")

    // load too programs and link them into a program
    var program = createProgram(gl,
        createShader(gl, await fetch('/res/vert.vert').then(f => f.text()), gl.VERTEX_SHADER),
        createShader(gl, await fetch('/res/frag.frag').then(f => f.text()), gl.FRAGMENT_SHADER)
    )

    // create a new vertex array
    let vao = createVertexArray(gl, program, "vertexPosition")

    loop(() => {
        // tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        // clear the canvas
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        // use the shaders we want
        gl.useProgram(program)

        // bind the attribute/buffer set we want
        gl.bindVertexArray(vao)

        // do a draw call!
        var primitiveType = gl.TRIANGLES
        var offset = 0
        var count = 3
        gl.drawArrays(primitiveType, offset, count)
    })
}

main()