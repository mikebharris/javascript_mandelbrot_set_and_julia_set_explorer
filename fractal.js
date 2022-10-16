//
// JavaScript methods to draw Mandelbrot and Julia Sets
//
// version 1.4 - featuring LSM and BDM methods, iterations slider, colour palettes, auto draw julia set mode, and zoom mode
//
// (c) 2009-2022 Mike Harris; (c) 1987-1990 Mike Harris & Dan Grace
// Free software released under GNU Public Licence v2.0.
//

// set up colour palettes for colouring the levels outside the set itself
const colourPalettes =
    [
        ['#00429d', '#1448a0', '#204fa3', '#2955a6', '#315ca9', '#3862ac', '#3f69af', '#466fb2', '#4c76b5', '#527db7', '#5884ba', '#5e8abd', '#6491c0', '#6a98c2', '#709fc5', '#76a6c8', '#7cadca', '#83b4cd', '#89bbcf', '#90c2d2', '#97c9d4', '#9fd0d6', '#a7d6d8', '#afddda', '#b8e4dc', '#c2eade', '#ccf1e0', '#d9f7e1', '#e8fce1', '#ffffe0'],
        ['#94003a', '#98163e', '#9c2341', '#a12e45', '#a53849', '#a9414d', '#ae4951', '#b25155', '#b65959', '#ba615e', '#be6962', '#c27167', '#c6796b', '#ca8070', '#cd8874', '#d19079', '#d5977e', '#d99f83', '#dca689', '#e0ae8e', '#e3b694', '#e7bd9a', '#eac5a0', '#edcda6', '#f1d4ad', '#f4dcb4', '#f7e4bc', '#faebc5', '#fdf3cf', '#fffadf'],
        ['#890079', '#8c197d', '#8e2881', '#903385', '#933d89', '#95478d', '#975091', '#995995', '#9b619a', '#9d699e', '#9f71a2', '#a179a6', '#a281aa', '#a489af', '#a691b3', '#a798b7', '#a9a0bc', '#aba8c0', '#adafc5', '#afb7c9', '#b1bece', '#b3c6d2', '#b6cdd7', '#b8d5dc', '#bcdce1', '#c0e3e6', '#c5eaeb', '#ccf0f1', '#d5f6f7', '#e9f9ff'],
        ['#007600', '#177b09', '#257f12', '#318419', '#3b8921', '#448e28', '#4d922f', '#569736', '#5e9c3d', '#66a144', '#6fa54c', '#77aa54', '#7faf5b', '#86b463', '#8eb86b', '#96bd74', '#9ec27c', '#a6c685', '#adcb8e', '#b5d097', '#bcd5a1', '#c4d9aa', '#cbdeb4', '#d3e3be', '#dae7c8', '#e2ecd3', '#e9f1de', '#f0f6e8', '#f8faf4', '#ffffff'],
        ['#007600', '#257f11', '#3a8820', '#4b912d', '#5c9b3b', '#6ca449', '#7bad58', '#8bb668', '#9abf78', '#a9c889', '#b7d19a', '#c6dbad', '#d4e4c0', '#e3edd4', '#f1f6e9', '#ffeed3', '#ffdcc6', '#ffcab9', '#ffb8ab', '#ffa59e', '#fd9291', '#f78085', '#f06f7a', '#e75d6f', '#dd4c65', '#d23b5b', '#c52a52', '#b61849', '#a60741', '#93003a'],
        ['#007ca6', '#0986ac', '#198fb2', '#2999b8', '#39a3bf', '#48acc5', '#59b5cb', '#69bed1', '#7ac7d7', '#8ccfdc', '#9ed8e2', '#b0e0e8', '#c3e8ee', '#d7f0f4', '#ebf8f9', '#ffeed3', '#ffdcc6', '#ffcab9', '#ffb8ab', '#ffa59e', '#fd9291', '#f78085', '#f06f7a', '#e75d6f', '#dd4c65', '#d23b5b', '#c52a52', '#b61849', '#a60741', '#93003a'],
        ['#007ca6', '#0986ac', '#198fb2', '#2999b8', '#39a3bf', '#48acc5', '#59b5cb', '#69bed1', '#7ac7d7', '#8ccfdc', '#9ed8e2', '#b0e0e8', '#c3e8ee', '#d7f0f4', '#ebf8f9', '#e8f7ea', '#e3f0eb', '#dde8ed', '#d7e1ee', '#d1daef', '#cbd3f0', '#c4cbf1', '#bdc4f2', '#b7bdf2', '#afb6f3', '#a8aff3', '#a0a9f3', '#98a2f2', '#8f9cf1', '#7a9cdc'],
        ['#ef1d00', '#e54d29', '#dc6744', '#d47b5c', '#cc8c72', '#c59b87', '#c0a899', '#bcb5aa', '#bac0ba', '#bacbc8', '#bed5d4', '#c5dfdf', '#cfe8e9', '#dcf0f2', '#edf8f9', '#20f8ff', '#2ef2ff', '#38ebff', '#40e4ff', '#47deff', '#4cd7ff', '#50d0ff', '#54cafe', '#58c3fe', '#5bbcfd', '#5eb6fc', '#60affb', '#63a9fa', '#65a2f8', '#7a9cdc'],
        ['#00429d', '#1f4ea3', '#305ba9', '#3e67ae', '#4a74b4', '#5681b9', '#618fbf', '#6d9cc4', '#79a9c9', '#85b7ce', '#93c4d2', '#a1d1d7', '#b1dfdb', '#c3ebde', '#daf7e1', '#ffeed3', '#ffdcc6', '#ffcab9', '#ffb8ab', '#ffa59e', '#fd9291', '#f78085', '#f06f7a', '#e75d6f', '#dd4c65', '#d23b5b', '#c52a52', '#b61849', '#a60741', '#93003a'],
        ['#000000', '#090d0c', '#111615', '#161e1c', '#1b2523', '#202d2a', '#253531', '#2a3d38', '#304540', '#364d47', '#3b564f', '#415e57', '#48675f', '#4e7067', '#55796f', '#5c8277', '#638b7f', '#6a9487', '#729e8f', '#7aa798', '#83b1a0', '#8cbaa8', '#96c3b1', '#a0cdb9', '#aad6c1', '#b6dfc9', '#c3e9d0', '#d1f1d7', '#e3fadd', '#ffffe0'],
        ['#914ce2', '#9953dc', '#a059d7', '#a760d1', '#ad66cc', '#b36dc7', '#b973c2', '#be79bd', '#c380b9', '#c786b4', '#cc8cb0', '#d093ac', '#d499a8', '#d89fa4', '#dba5a0', '#dfac9d', '#e2b29a', '#e5b897', '#e8be95', '#ebc493', '#eeca92', '#f1d192', '#f4d792', '#f7dd94', '#f9e396', '#fce99b', '#feefa3', '#fff5ae', '#fffac1', '#ffffe0'],
        ['#914ce2', '#a059d7', '#ad66cd', '#b872c3', '#c27eba', '#ca8ab1', '#d296a9', '#daa2a2', '#e0af9c', '#e6ba96', '#ecc693', '#f2d292', '#f7de94', '#fcea9c', '#fff5af', '#ffeed3', '#ffdcc6', '#ffcab9', '#ffb8ab', '#ffa59e', '#fd9291', '#f78085', '#f06f7a', '#e75d6f', '#dd4c65', '#d23b5b', '#c52a52', '#b61849', '#a60741', '#93003a']
    ]

const xResolution = document.getElementById("mset_canvas").clientWidth;
const yResolution = document.getElementById("mset_canvas").clientHeight;

const defaultMsetPlane = {x_min: -2.5, y_min: -1.25, x_max: 0.8, y_max: 1.25};
const defaultJsetPlane = {x_min: -2.25, y_min: -1.8, x_max: 2.25, y_max: 1.8};

const ZOOM_MODE = 'zoom';
const EXPLORE_MODE = 'explore';
let mode = EXPLORE_MODE

class FractalChunk {
    constructor(imageData, x, y, w, h) {
        this.imageData = imageData
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}

let canvasBeforeZoomBox = null

function init() {
    document.getElementById("palette").setAttribute("max", (colourPalettes.length - 1).toString())
    setMsetWindowTo(defaultMsetPlane);
    setZoomWindowTo(160, 120, 320, 240)
}

function setMsetWindowTo(plane) {
    document.getElementById("x_min").value = plane.x_min
    document.getElementById("y_min").value = plane.y_min
    document.getElementById("x_max").value = plane.x_max
    document.getElementById("y_max").value = plane.y_max
}

function setZoomWindowTo(x, y, w, h) {
    document.getElementById("zoom_x").value = x
    document.getElementById("zoom_y").value = y
    document.getElementById("zoom_w").value = w
    document.getElementById("zoom_h").value = h
}

function getCurrentZoomWindow() {
    return {
        x: parseFloat(document.getElementById("zoom_x").value),
        y: parseFloat(document.getElementById("zoom_y").value),
        w: parseFloat(document.getElementById("zoom_w").value),
        h: parseFloat(document.getElementById("zoom_h").value)
    }
}

function selectMethod() {
    if (document.getElementById('method').value === 'lsm') {
        document.getElementById("palette_chooser").style.display = 'inline'
    } else {
        document.getElementById("palette_chooser").style.display = 'none'
    }
}

function getCurrentPlane() {
    return {
        x_min: parseFloat(document.getElementById("x_min").value),
        y_min: parseFloat(document.getElementById("y_min").value),
        x_max: parseFloat(document.getElementById("x_max").value),
        y_max: parseFloat(document.getElementById("y_max").value)
    };
}

function mandelbrot() {
    let currentPlane = getCurrentPlane()
    drawSet(document.getElementById("mset_canvas"), mandelbrotDrawingFunc, currentPlane)
}

function julia() {
    drawSet(document.getElementById("jset_canvas"), juliaDrawingFunc, defaultJsetPlane)
}

function drawSet(canvas, drawingFunc, plane) {
    const ctx = canvas.getContext("2d");
    ctx.reset()
    const max_iters = document.getElementById('iterations').value;
    const method = document.getElementById('method').value;

    drawingFunc(ctx, max_iters, getColouringFunctionForMethod(method), plane)
}

function getColouringFunctionForMethod(method) {
    switch (method) {
        case 'bdm':
            return setColourUsingBinaryDecompositionMethod
        case 'lsm':
        default:
            return setColourUsingLevelSetMethod
    }
}

function setColourUsingBinaryDecompositionMethod(iterations, maxIterations, ctx, point) {
    if (iterations == maxIterations) {
        // if we didn't get to infinity by the time we
        // used up all the iterations, then we're in the set
        // colour it bloack
        ctx.fillStyle = "#000000";
    } else {
        // color it depending on the angle of alpha
        const alpha = Math.atan(point.y);
        if ((alpha >= 0) && (alpha <= 3)) {
            ctx.fillStyle = "#fff";
        } else {
            ctx.fillStyle = "#000";
        }
    }
}

function setColourUsingLevelSetMethod(iterations, maxIterations, ctx) {
    if (iterations == maxIterations) {
        // if we didn't get to infinity by the time we
        // used up all the iterations, then we're in the set
        // colour it bloack
        ctx.fillStyle = "#000000";
    } else {
        // otherwise colour it according to the number
        // of iterations it took to get to infinity (threshold)
        const paletteNumber = document.getElementById('palette').value;
        ctx.fillStyle = colourPalettes[paletteNumber][iterations % colourPalettes[paletteNumber].length];
    }
}

function mandelbrotDrawingFunc(ctx, maxIterations, pointColouringFunc, plane) {
    const scalingFactor = getScalingFactors(plane);

    for (let iy = 0; iy < yResolution; iy++) {
        const cy = plane.y_min + iy * scalingFactor.y;

        for (let ix = 0; ix < xResolution; ix++) {
            const cx = plane.x_min + ix * scalingFactor.x;
            const currentPoint = {x: 0.0, y: 0.0};
            const iterations = computePoint(currentPoint, cx, cy, maxIterations);

            pointColouringFunc(iterations, maxIterations, ctx, currentPoint);
            ctx.fillRect(ix, iy, 1, 1);
        }
    }
}

function getScalingFactors(plane) {
    // calculate the proportion in the difference between the points
    // on the mathematical plane and the actual canvas size
    return {x: (plane.x_max - plane.x_min) / (xResolution - 1), y: (plane.y_max - plane.y_min) / (yResolution - 1)}
}

function juliaDrawingFunc(ctx, maxIterations, pointColouringFunc, plane) {
    const scalingFactor = getScalingFactors(plane);

    const cx = Number(document.getElementById('cx').value);
    const cy = Number(document.getElementById('cy').value);

    for (let iy = 0; iy < yResolution; iy++) {
        const y = plane.y_min + iy * scalingFactor.y;

        for (let ix = 0; ix < xResolution; ix++) {
            const currentPoint = {x: plane.x_min + ix * scalingFactor.x, y: y};
            const iterations = computePoint(currentPoint, cx, cy, maxIterations);

            pointColouringFunc(iterations, maxIterations, ctx, currentPoint)
            ctx.fillRect(ix, iy, 1, 1);
        }
    }
}

function computePoint(point, cx, cy, maxIterations) {
    const threshold = 10000.00; // threshold above which value is considered to tend to infinity

    let x2 = point.x * point.x;
    let y2 = point.y * point.y;
    let iterations = 0;
    while ((iterations < maxIterations) && ((x2 + y2) < threshold)) {
        let temp = x2 - y2 + cx;
        point.y = 2 * point.x * point.y + cy;
        point.x = temp;
        x2 = point.x * point.x;
        y2 = point.y * point.y;
        iterations++;
    }
    return iterations;
}

function setJuliaSetCoordinates(evt, obj) {
    const x_pos = evt.clientX - obj.offsetLeft;
    const y_pos = evt.clientY - obj.offsetTop;
    const currentPlane = getCurrentPlane();
    const scalingFactors = getScalingFactors(currentPlane);
    const cx = currentPlane.x_min + x_pos * scalingFactors.x;
    const cy = currentPlane.y_min + y_pos * scalingFactors.y;

    document.getElementById('cx').value = cx;
    document.getElementById('cy').value = cy;
}

function zoomToNewWindow(ctx, canvas) {
    const {x, y, w, h} = getCurrentZoomWindow();
    const currentPlane = getCurrentPlane();
    const scalingFactors = getScalingFactors(currentPlane);
    const zoomedPlane = {
        x_min: currentPlane.x_min + x * scalingFactors.x,
        y_min: currentPlane.y_min + y * scalingFactors.y,
        x_max: currentPlane.x_min + (x + w) * scalingFactors.x,
        y_max: currentPlane.y_min + (y + h) * scalingFactors.y
    };

    setMsetWindowTo(zoomedPlane)
    ctx.reset()
    drawSet(canvas, mandelbrotDrawingFunc, zoomedPlane)
    mode = EXPLORE_MODE
}

function keyCommandProcessor(e) {
    const eventObject = window.event ? event : e; //distinguish between IE's explicit event object (window.event) and Firefox's implicit.
    const keyCode = eventObject.charCode ? eventObject.charCode : eventObject.keyCode;
    const Z_KEY_CODE = 90;
    const C_KEY_CODE = 67;
    const ENTER_KEY_CODE = 13;
    let canvas = document.getElementById("mset_canvas");
    let ctx = canvas.getContext("2d");
    switch (keyCode) {
        case Z_KEY_CODE:
            if (mode !== ZOOM_MODE) {
                mode = ZOOM_MODE
                drawZoomBox(ctx, getCurrentZoomWindow())
            } else {
                ctx.reset()
                mandelbrot()
                mode = EXPLORE_MODE
            }
            break;
        case C_KEY_CODE:
            alert("colour cycling mode - coming soon");
            break;
        case ENTER_KEY_CODE:
            if (mode === ZOOM_MODE) {
                zoomToNewWindow(ctx, canvas)
            }
            break;
        default:
            console.log("key code is " + keyCode)
    }
}

function drawJuliaSetForCurrentC(event, obj) {
    setJuliaSetCoordinates(event, obj);
    julia(event, obj);
}

function handleMsetMouseMove(event, obj) {
    function moveZoomBox() {
        const {x, y, w, h} = getCurrentZoomWindow()
        let ctx = document.getElementById("mset_canvas").getContext("2d");
        if (canvasBeforeZoomBox != null) {
            ctx.putImageData(canvasBeforeZoomBox.imageData, canvasBeforeZoomBox.x, canvasBeforeZoomBox.y)
        }
        const x_pos = event.clientX - obj.offsetLeft;
        const y_pos = event.clientY - obj.offsetTop;
        drawZoomBox(ctx, {x: x_pos, y: y_pos, w: w, h: h})
    }

    switch (mode) {
        case ZOOM_MODE:
            moveZoomBox()
            break;
        default:
            if (document.getElementById('autodraw').value === 'on') {
                drawJuliaSetForCurrentC(event, obj);
            }
    }
}

function handleMsetMouseClick(event, obj) {
    function zoomIn() {
        let ctx = document.getElementById("mset_canvas").getContext("2d")
        if (canvasBeforeZoomBox != null) {
            ctx.putImageData(canvasBeforeZoomBox.imageData, canvasBeforeZoomBox.x, canvasBeforeZoomBox.y)
        }
        const {x, y, w, h} = getCurrentZoomWindow()
        setZoomWindowTo(x, y, Math.round(w * 0.9), Math.round(h * 0.9))
        drawZoomBox(ctx, getCurrentZoomWindow())
    }

    function zoomOut() {
        let ctx = document.getElementById("mset_canvas").getContext("2d")
        if (canvasBeforeZoomBox != null) {
            ctx.putImageData(canvasBeforeZoomBox.imageData, canvasBeforeZoomBox.x, canvasBeforeZoomBox.y)
        }
        const {x, y, w, h} = getCurrentZoomWindow()
        setZoomWindowTo(x, y, Math.round(w * 1.5), Math.round(h * 1.5))
        drawZoomBox(ctx, getCurrentZoomWindow())
    }

    switch (mode) {
        case ZOOM_MODE:
            switch (event.button) {
                case 0:
                    zoomIn()
                    break
                case 2:
                    zoomOut()
                    break
            }
            break
        default:
            drawJuliaSetForCurrentC(event, obj)
    }
}

function drawZoomBox(ctx, dimensions) {
    canvasBeforeZoomBox = new FractalChunk(
        ctx.getImageData(dimensions.x, dimensions.y, dimensions.w, dimensions.h),
        dimensions.x, dimensions.y, dimensions.w, dimensions.h)

    ctx.beginPath()
    ctx.fillStyle = "#FFFFFF"
    ctx.globalAlpha = 0.5
    ctx.fillRect(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
    setZoomWindowTo(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
}