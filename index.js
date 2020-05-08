let vertices = []
let edges = []

function Vertex(x, y) {
    // make sure the vertices dosent allready exist
    for (let vertex of vertices) if ( vertex[0] == x && vertex[1] == y ) return vertex

    // create a new vertex
    let vertex = [x, y]

    // add it to the list
    vertices.push(vertex)

    // and return it for the world to use
    return vertex
}

function Edge(x1, y1, x2, y2) {
    // create the edge
    let edge = [ Vertex(x1, y1), Vertex(x2, y2) ]

    // add it to the list of edges
    edges.push(edge)

    // and return it for the world to use
    return edge
}

function raycast([x1, y1], [x2, y2]) {
    let dist = Infinity

    for (let [[x3, y3], [x4, y4]] of edges) {
        let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

        // there parallel, they never intersect
        if (den == 0) continue

        let t =  ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) * Math.sign(den)
        let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) * Math.sign(den)

        if (t >= 0 && t <= Math.abs(den) && u >= 0 && u <= Math.abs(den)) dist = Math.min(t / den * Math.sign(den), dist)
    }

    if ( dist == Infinity ) return [x2, y2]

    return [x1 + dist * (x2 - x1), y1 + dist * (y2 - y1)]
}

function lightCones(src) {
    let rays = vertices
        .map(vertex => raycast(src, vertex))
        .sort(([x1, y1], [x2, y2]) => {
            if (x1 - src[0] >= 0 && x2 - src[0]  < 0) return  1
            if (x1 - src[0]  < 0 && x2 - src[0] >= 0) return -1

            if (x1 - src[0] == 0 && x2 - src[0] == 0) {
                if (y1 - src[1] >= 0 || y2 - src[1] >= 0) return y1 - y2

                return y2 - y1
            }

            // compute the cross product of vectors (center -> a) x (center -> b)
            let det = (x1 - src[0]) * (y2 - src[1]) - (x2 - src[0]) * (y1 - src[1])
            if (det < 0) return  1
            if (det > 0) return -1

            // points a and b are on the same line from the center
            // check which point is closer to the center
            let d1 = (x1 - src[0]) * (x1 - src[0]) + (y1 - src[1]) * (y1 - src[1])
            let d2 = (x2 - src[0]) * (x2 - src[0]) + (y2 - src[1]) * (y2 - src[1])

            return d1 - d2
        })
    
    push()

    noStroke()
    fill(100, 100, 100)

    for (let i = 0; i < rays.length; i++) {
        line(  ...rays[i], ...rays[(i + 1) % rays.length] )
        triangle( ...src, ...rays[i], ...rays[(i + 1) % rays.length] )
    }

    pop()
}

function drawRaycastFromSource(src) {
    vertices.forEach(vertex => {
        strokeWeight(5)
        let rayout = raycast( src, vertex )
        line( ...src, ...rayout )

        strokeWeight(1)
        line( ...src, ...vertex )
    })
}

function drawEdges() {
    push()
    strokeWeight(10)
    edges.forEach(([[x1, y1], [x2, y2]]) => line(x1, y1, x2, y2))
    pop()
}

function setup() {
    createCanvas(windowWidth, windowHeight)

    Vertex(0, 0)
    Vertex(windowWidth, 0)
    Vertex(0, windowHeight)
    Vertex(windowWidth, windowHeight)

    let doorSize = 50
    Edge(100, 100, 100, 500)
    Edge(100, 500, 300 - doorSize, 500)
    Edge(300 + doorSize, 500, 500, 500)
    Edge(500, 500, 500, 100)
    Edge(100, 100, 500, 100)
}

function draw() {
    update(deltaTime)
    clear()

    // drawRaycastFromSource([ mouseX, mouseY ])
    lightCones( [ mouseX, mouseY ] )

    drawEdges()
}

function update(dt) {

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}