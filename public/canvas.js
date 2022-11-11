const canvas = document.querySelector("canvas");
const signatureInput = document.querySelector("input[name='signature']");

const context = canvas.getContext("2d");

let rect = canvas.getBoundingClientRect();
let { top: canvasTop, left: canvasLeft } = rect;

let startX;
let startY;

let isDragging = false;

canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = event.clientX - canvasLeft;
    startY = event.clientY - canvasTop;
});

canvas.addEventListener("mousemove", function (event) {
    if (!isDragging) {
        return;
    }

    let actualX = event.clientX - canvasLeft;
    let actualY = event.clientY - canvasTop;

    draw(actualX, actualY);
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;

    let exportedCanvas = canvas.toDataURL();
    signatureInput.value = exportedCanvas;
});

function draw(x, y) {
    context.strokeStyle = "#e86e80";
    context.lineWidth = 5;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(x, y);
    context.stroke();
    context.closePath();
    startX = x;
    startY = y;
}
