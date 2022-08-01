const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");
context.strokeStyle = "purple";
context.lineWidth = 10;
context.lineCap = "round";

let isDragging = false;
let exportedCanvas = "";

let positionY = window.pageYOffset;
let rect = canvas.getBoundingClientRect();
let { right, bottom, left } = rect;
let canvasTop = rect.top;

const signatureInput = document.querySelector("input[name='signature']");

canvas.addEventListener("mousedown", (event) => {
    initialX = event.clientX - left;
    initialY = event.clientY - canvasTop;
    //console.log("mousedown");

    //console.log("canvasSize", canvasSize);
    //console.log("canvas width height", canvasWidth, canvasHeight);

    isDragging = true;
});

canvas.addEventListener("mousemove", function (event) {
    // console.log("Moving---");
    //event.clientX gives us the horizontal pos of the mousedown
    if (!isDragging) {
        return;
    }

    let actualY = event.clientY - canvasTop;
    let actualX = event.clientX - left;

    let newX = actualX - 5;
    let newY = actualY - 5;

    function draw() {
        context.beginPath();
        context.moveTo(actualX, actualY);
        context.lineTo(newX, newY);
        context.stroke();
    }
    draw();
    //to export it!
    exportedCanvas = canvas.toDataURL();
    //console.log(exportedCanvas);
    signatureInput.value = exportedCanvas;
    console.log(signatureInput.value);
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});
