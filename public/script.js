let canvas = document.querySelector("canvas");

//start of my attempt--------------
/* let context = canvas.getContext("2d");
context.strokeStyle = "black";
context.lineWidth = 6;
var isDragging = false;
var canvasSize = canvas.width;
var centerX = canvasSize / 2;
var centerY = canvasSize / 2;
var initialPosition = canvas.offsetWidth;

canvas.addEventListener("mousedown", () => {
    console.log("mousedown");

    console.log("canvasSize", canvasSize);

    isDragging = true;
});

canvas.addEventListener("mousemove", function (event) {
    //console.log("Moving---");
    //event.clientX gives us the horizontal pos of the mousedown
    if (!isDragging) {
        return;
    }

    var borderRight = canvasSize + initialPosition.left;
    var borderTop = canvasSize + initialPosition.top;
    var newX = event.clientX - initialPosition.left;
    var newY = event.clientY - initialPosition.left;
    console.log(newX, newY);

  

    function draw() {
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(centerY, 110);
        context.stroke();
    }
    draw();
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});
 */
//stack overflow solution ------

// get canvas 2D context and set him correct size
var ctx = canvas.getContext("2d");
//resize();

// last known position
var pos = { x: 0, y: 0 };

window.addEventListener("resize", resize);
document.addEventListener("mousemove", draw);
document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseenter", setPosition);

// new position from mouse event
function setPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
}

// resize canvas
function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

function draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#c0392b";

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!
}
