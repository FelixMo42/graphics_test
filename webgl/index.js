import {
    createShader,
    createProgram,
    loop
} from "./boilerplate.js"

async function main() {
    // get the canvas we want to draw too
    const canvas = document.getElementById("game")
    const gl = canvas.getContext("webgl2")
    
    // load in and compile all the shaders we want
    const vs = createShader( gl , await fetch('/res/frag.frag').then(f => f.text()) , gl.FRAGMENT_SHADER )
    const fs = createShader( gl , await fetch('/res/vert.vert').then(f => f.text()) , gl.VERTEX_SHADER   )

    // join the shaders together into a single programe
    const program = createProgram( gl , vs , fs )

    loop(() => {
        // clear the screen
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        
    })
}

main()