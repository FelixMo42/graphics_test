let vertices = []
let edges = []

const ArrayHas = (array, value) => array.some(el => el == value)

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

let sortPointAround = src => ([x1, y1], [x2, y2]) => {
    if (x1 - src[0] >= 0 && x2 - src[0]  < 0) return  1
    if (x1 - src[0]  < 0 && x2 - src[0] >= 0) return -1

    if (x1 - src[0] == 0 && x2 - src[0] == 0) {
        if (y1 - src[1] >= 0 || y2 - src[1] >= 0) return y1 - y2

        return y2 - y1
    }

    let det = (x1 - src[0]) * (y2 - src[1]) - (x2 - src[0]) * (y1 - src[1])
    if (det < 0) return  1
    if (det > 0) return -1

    let d1 = (x1 - src[0]) * (x1 - src[0]) + (y1 - src[1]) * (y1 - src[1])
    let d2 = (x2 - src[0]) * (x2 - src[0]) + (y2 - src[1]) * (y2 - src[1])

    return d1 - d2
}

function lightCones(src) {
    let rays = vertices.sort(sortPointAround(src))

    for (let ray of rays) {
        
    }
    
    push()

    noStroke()
    fill(100, 100, 100)

    for (let i = 0; i < rays.length; i++) {
        line(  ...rays[i], ...rays[(i + 1) % rays.length] )
        triangle( ...src, ...rays[i], ...rays[(i + 1) % rays.length] )
    }

    pop()
}

function raycast2([x1, y1], [x2, y2]) {
    let dist1 = Infinity
    let dist2 = Infinity
    let edges = []

    for (let e of edges) {
        let [[x3, y3], [x4, y4]] = e

        let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

        // there parallel, they never intersect
        if (den == 0) continue

        let t =  ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) * Math.sign(den)
        let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) * Math.sign(den)

        if (t > 0 && u > 0 && u < Math.abs(den)) dist1 = Math.min(t / den * Math.sign(den), dist1)
        if (t >= 0 && u >= 0 && u <= Math.abs(den)) {
            if ( t / den * Math.sign(den) < dist2 ) {
                dist2 = t / den * Math.sign(den)
                edges = [e]
            }

            if ( t / den * Math.sign(den) == dist2 ) {
                edges.push( e )
            }
        }
    }

    return [
        dist1 == Infinity ? [x2, y2] : [x1 + dist1 * (x2 - x1), y1 + dist1 * (y2 - y1)],
        dist2 == Infinity ? [x2, y2] : [x1 + dist2 * (x2 - x1), y1 + dist2 * (y2 - y1)],
        dist2 < dist1 ? edge : []
    ]
}

function drawRaycastFromSource(src) {
    let last = src

    let currEdge = null

    vertices.sort(sortPointAround(src)).forEach(vertex => {
        let [rayout1, _, edge] = raycast2( src, vertex )

        console.log(edge)

        if ( edge.length == 0 ) {
            push()
            noStroke()
            fill(100,100,100,100)
            triangle( ...rayout1, ...src, ...last )
            pop()

            last = rayout1
        } else if ( ArrayHas(currEdge, edge[0]) ) {
            let vert = edge[0][0] == vertex ? edge[0] : edge[1]

            push()
            noStroke()
            fill(100,100,100,100)
            triangle( ...vert, ...src, ...last )
            pop()

            last = rayout1
        } else {
            let vert = edge[0][0] == vertex ? edge[0] : edge[1]

            push()
            noStroke()
            fill(100,100,100,100)
            triangle( ...rayout1, ...src, ...last )
            pop()

            last = vert
        }

        edge = currEdge

        strokeWeight(1)
        line( ...src, ...rayout1 )

        // strokeWeight(5)
        // line( ...src, ...rayout1 )

        // strokeWeight(10)
        // line( ...src, ...rayout2 )
    })
}

function drawEdges() {
    push()
    strokeWeight(4)
    edges.forEach(([[x1, y1], [x2, y2]]) => line(x1, y1, x2, y2))
    pop()
}

// p5 functions //

function setup() {
    createCanvas(windowWidth, windowHeight)

    Edge(0, 0, 0, windowHeight)
    Edge(0, windowHeight, windowWidth, windowHeight)
    Edge(windowWidth, windowHeight, windowWidth, 0)
    Edge(windowWidth, 0, 0, 0)

    let doorSize = 50
    // Edge(100, 100, 100, 500)
    Edge(100, 500, 300 - doorSize, 500)
    Edge(300 + doorSize, 500, 500, 500)
    Edge(500, 500, 500, 100)
    Edge(100, 100, 500, 100)

    noLoop()
}

function draw() {
    clear()

    drawRaycastFromSource(mouseClickedPos)

    drawEdges()
}

let mouseClickedPos = [ 684, 750 ]

function mouseClicked() {
    console.log(mouseX, mouseY)
    mouseClickedPos = [ mouseX, mouseY ]
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}