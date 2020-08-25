"use strict"

import {
    fetchShader,
    createProgram,
    createQuadIndexArray,
    createVertexArray,
    resizeCanvas,
    loop
} from "./boilerplate.js"

let sprites = 0

function drawQuad(gl, vao, x, y, w, h) {
    let offset = sprites * 8

    // set the buffer data for the sprite
    vao.data[offset + 0] = x
    vao.data[offset + 1] = y
    vao.data[offset + 2] = x
    vao.data[offset + 3] = y + h
    vao.data[offset + 4] = x + w
    vao.data[offset + 5] = y
    vao.data[offset + 6] = x + w
    vao.data[offset + 7] = y + h
    
    // incrament are count of how many sprites there are
    sprites += 1

    // load the new data
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vao.data, 0, sprites * 8)
}

// async function 

async function main() {
    // get A WebGL context
    var gl = document.querySelector("#game").getContext("webgl2")

    // load too programs and link them into a program
    var program = createProgram(gl,
        await fetchShader(gl, '/res/vert.vert', gl.VERTEX_SHADER),
        await fetchShader(gl, '/res/frag.frag', gl.FRAGMENT_SHADER)
    )

    // create a new vertex array
    let vao = createVertexArray(gl, program, "vertexPosition",1000)

    createQuadIndexArray(gl, 1000)

    drawQuad(gl, vao,  0,  0, 100, 100)
    // drawQuad(gl, vao, 0.5, 0.5, 0.5, 0.5)

    let cameraPositionLocation = gl.getAttribLocation(program, "u_cameraPosition")
    let screenResolutionLocation = gl.getAttribLocation(program, "u_screenResolution")

    console.log(cameraPositionLocation, screenResolutionLocation)

    loop(() => {
        // tell WebGL how to convert from clip space to pixels
        resizeCanvas(gl.canvas)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        // gl.uniform2f(screenResolutionLocation, gl.canvas.width, gl.canvas.height)

        // clear the canvas
        gl.clearColor(0, 0.5, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        // use the shaders we want
        gl.useProgram(program)

        // bind the attribute/buffer set we want
        gl.bindVertexArray(vao.vao)

        // do a draw call!
        gl.drawElements(gl.TRIANGLES, sprites * 6, gl.UNSIGNED_SHORT, 0)
    })
}

main()