let mouseClickedPos = [ 0, 0 ]

function setup() {
    createCanvas(windowWidth, windowHeight)
}

function mouseClicked() {
    mouseClickedPos = [ mouseX, mouseY ]
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

function draw() {
    
}