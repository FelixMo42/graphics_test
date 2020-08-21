"use strict"

import {
    fetchShader,
    createProgram,
    createQuadIndexArray,
    createVertexArray,
    resizeCanvas,
    loop
} from "./boilerplate.js"

async function main() {
    // get A WebGL context
    var gl = document.querySelector("#game").getContext("webgl2")

    // load too programs and link them into a program
    var program = createProgram(gl,
        await fetchShader(gl, '/res/vert.vert', gl.VERTEX_SHADER),
        await fetchShader(gl, '/res/frag.frag', gl.FRAGMENT_SHADER)
    )

    // create a new vertex array
    let vao = createVertexArray(gl, program, "vertexPosition")

    createQuadIndexArray(gl)

    loop(() => {
        // tell WebGL how to convert from clip space to pixels
        resizeCanvas(gl.canvas)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        // clear the canvas
        gl.clearColor(0, 0.5, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        // use the shaders we want
        gl.useProgram(program)

        // bind the attribute/buffer set we want
        gl.bindVertexArray(vao)

        // do a draw call!
        let primitiveType = gl.TRIANGLES
        let count = 1 * 6
        let indexType = gl.UNSIGNED_SHORT
        let offset = 0
        gl.drawElements(primitiveType, count, indexType, offset)
    })
}

main()