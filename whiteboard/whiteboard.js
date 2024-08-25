const canvas = document.getElementById('whiteboard');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let color = '#000000';
let thickness = 1;

// Initialize Fabric.js canvas
const fabric_canvas = new fabric.Canvas('whiteboard', {
    isDrawingMode: true
});

updateDrawingSettings();

// Update drawing settings based on UI
function updateDrawingSettings() {
    fabric_canvas.freeDrawingBrush.color = color;
    fabric_canvas.freeDrawingBrush.width = thickness;
}

function addPencil() {
    fabric_canvas.isDrawingMode = true;
    updateDrawingSettings();
}

function handleColorChange(event) {
    color = event.target.value;
    updateDrawingSettings();
}

function handleThicknessChange(event) {
    thickness = parseInt(event.target.value, 10);
    updateDrawingSettings();
}

function addPencil() {
    fabric_canvas.isDrawingMode = true;
}

function enableSelection() {
    fabric_canvas.isDrawingMode = false;
}

// Function to add a rectangle to the canvas
function addRectangle() {
    // Create a rectangle object
    const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: '',
        stroke: color,
        strokeWidth: thickness,
        width: 100,
        height: 100,
        hasBorders: true,
        hasControls: true,
        lockRotation: true,
    });
    // Add the rectangle to the fabric_canvas
    fabric_canvas.add(rect);
    // Set the rectangle as selected (optional)
    fabric_canvas.setActiveObject(rect);
    fabric_canvas.isDrawingMode = false;
}

function addText() {
    // Create a Textbox object
    const text = new fabric.Textbox('hello world', {
        left: 100,
        top: 100,
        fontSize: 20,
        width: 200, // Define a width to make it resizable and editable
        editable: true // Optional: Textbox is editable by default
    });

    // Add the Textbox to the fabric_canvas
    fabric_canvas.add(text);

    // Set the Textbox as active (optional)
    fabric_canvas.setActiveObject(text);

    // Ensure the drawing mode is off
    fabric_canvas.isDrawingMode = false;
}

function addCircle() {
    var circle = new fabric.Circle({
        radius: 20,
        fill: '',
        stroke: color,
        strokeWidth: thickness,
        left: 100,
        top: 100
    });
    fabric_canvas.add(circle);
    fabric_canvas.setActiveObject(circle);
    fabric_canvas.isDrawingMode = false;
}

// Function to remove the active object from the fabric_canvas
function remove() {
    const activeObject = fabric_canvas.getActiveObject();
    if (activeObject) {
        fabric_canvas.remove(activeObject);
        fabric_canvas.discardActiveObject(); // Optional: Clear active selection
    }
}

function clear() {
    fabric_canvas.clear();
}

// Attach event listener to the button
document.getElementById('pencil').addEventListener('click', addPencil);
document.getElementById('color-picker').addEventListener('change', handleColorChange);
document.getElementById('thickness-picker').addEventListener('input', handleThicknessChange);
document.getElementById('rectangle').addEventListener('click', addRectangle);
document.getElementById('circle').addEventListener('click', addCircle);
document.getElementById('text').addEventListener('click', addText);
document.getElementById('select').addEventListener('click', enableSelection);
document.getElementById('delete').addEventListener('click', remove);
document.getElementById('clear').addEventListener('click', clear);