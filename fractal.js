//
// JavaScript methods to draw Mandelbrot and Julia Sets
//
// version 1.2 - featuring LSM and BDM methods, iterations slider and auto draw julia set mode
//
// (c) 2009-2015 Mike Harris.  
// Free software released under GNU Public Licence v2.0.
//

// set up colour palettes for colouring the levels outside the set itself
const colour_palettes =
    [
        ['#00429d', '#1448a0', '#204fa3', '#2955a6', '#315ca9', '#3862ac', '#3f69af', '#466fb2', '#4c76b5', '#527db7', '#5884ba', '#5e8abd', '#6491c0', '#6a98c2', '#709fc5', '#76a6c8', '#7cadca', '#83b4cd', '#89bbcf', '#90c2d2', '#97c9d4', '#9fd0d6', '#a7d6d8', '#afddda', '#b8e4dc', '#c2eade', '#ccf1e0', '#d9f7e1', '#e8fce1', '#ffffe0'],
        ['#94003a', '#98163e', '#9c2341', '#a12e45', '#a53849', '#a9414d', '#ae4951', '#b25155', '#b65959', '#ba615e', '#be6962', '#c27167', '#c6796b', '#ca8070', '#cd8874', '#d19079', '#d5977e', '#d99f83', '#dca689', '#e0ae8e', '#e3b694', '#e7bd9a', '#eac5a0', '#edcda6', '#f1d4ad', '#f4dcb4', '#f7e4bc', '#faebc5', '#fdf3cf', '#fffadf'],
        ['#890079', '#8c197d', '#8e2881', '#903385', '#933d89', '#95478d', '#975091', '#995995', '#9b619a', '#9d699e', '#9f71a2', '#a179a6', '#a281aa', '#a489af', '#a691b3', '#a798b7', '#a9a0bc', '#aba8c0', '#adafc5', '#afb7c9', '#b1bece', '#b3c6d2', '#b6cdd7', '#b8d5dc', '#bcdce1', '#c0e3e6', '#c5eaeb', '#ccf0f1', '#d5f6f7', '#e9f9ff'],
        ['#007600', '#177b09', '#257f12', '#318419', '#3b8921', '#448e28', '#4d922f', '#569736', '#5e9c3d', '#66a144', '#6fa54c', '#77aa54', '#7faf5b', '#86b463', '#8eb86b', '#96bd74', '#9ec27c', '#a6c685', '#adcb8e', '#b5d097', '#bcd5a1', '#c4d9aa', '#cbdeb4', '#d3e3be', '#dae7c8', '#e2ecd3', '#e9f1de', '#f0f6e8', '#f8faf4', '#ffffff'],
        ['#007600', '#257f11', '#3a8820', '#4b912d', '#5c9b3b', '#6ca449', '#7bad58', '#8bb668', '#9abf78', '#a9c889', '#b7d19a', '#c6dbad', '#d4e4c0', '#e3edd4', '#f1f6e9', '#ffeed3', '#ffdcc6', '#ffcab9', '#ffb8ab', '#ffa59e', '#fd9291', '#f78085', '#f06f7a', '#e75d6f', '#dd4c65', '#d23b5b', '#c52a52', '#b61849', '#a60741', '#93003a'],
        ['#007ca6', '#0986ac', '#198fb2', '#2999b8', '#39a3bf', '#48acc5', '#59b5cb', '#69bed1', '#7ac7d7', '#8ccfdc', '#9ed8e2', '#b0e0e8', '#c3e8ee', '#d7f0f4', '#ebf8f9', '#ffeed3', '#ffdcc6', '#ffcab9', '#ffb8ab', '#ffa59e', '#fd9291', '#f78085', '#f06f7a', '#e75d6f', '#dd4c65', '#d23b5b', '#c52a52', '#b61849', '#a60741', '#93003a'],
        ['#007ca6', '#0986ac', '#198fb2', '#2999b8', '#39a3bf', '#48acc5', '#59b5cb', '#69bed1', '#7ac7d7', '#8ccfdc', '#9ed8e2', '#b0e0e8', '#c3e8ee', '#d7f0f4', '#ebf8f9', '#e8f7ea', '#e3f0eb', '#dde8ed', '#d7e1ee', '#d1daef', '#cbd3f0', '#c4cbf1', '#bdc4f2', '#b7bdf2', '#afb6f3', '#a8aff3', '#a0a9f3', '#98a2f2', '#8f9cf1', '#7a9cdc']
    ]

// set up of 'screen' resolution, the size of our <canvas>
const x_resolution = 640;
const y_resolution = 480;

// set up the size of our real and imaginary planes      
const real_plane_minimum_value = -2.5;
const real_plane_maximum_value = 0.8;
const imaginary_plan_minimum_value = -1.25;
const imaginary_plan_maximum_value = 1.25;

// calculate the proportion in the difference between the points
// on the mathematical plane and the actual screen resolution	
const x_prop = (real_plane_maximum_value - real_plane_minimum_value) / (x_resolution - 1);
const y_prop = (imaginary_plan_maximum_value - imaginary_plan_minimum_value) / (y_resolution - 1);

const threshold = 10000.00; // threashold above which value is considered to tend to infinity
// the coloured bands on the outside of our Mandelbrot Set are
// a measure of how soon the values become unstable and hence the
// point on the plane is not within the set itself, not bounded by the set

function mandelbrot() {
    draw(document.getElementById("mset_canvas"), draw_mandelbrot)
}
function julia() {
    draw(document.getElementById("jset_canvas"), draw_julia)
}
function draw(canvas, set_drawing_func) {
    const ctx = canvas.getContext("2d");
    const max_iters = document.getElementById('iterations').value;
    const method = document.getElementById('method').value;

    set_drawing_func(ctx, max_iters, get_colouring_function(method))
}

function get_colouring_function(method) {
    switch (method) {
        case 'bdm':
            return set_colour_bdm
        case 'lsm':
        default:
            return set_colour_lsm
    }
}

function set_colour_bdm(iter, maxiter, ctx, point) {
    if (iter == maxiter) {
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

function set_colour_lsm(iter, max_iters, ctx) {
    if (iter == max_iters) {
        // if we didn't get to infinity by the time we
        // used up all the iterations, then we're in the set
        // colour it bloack
        ctx.fillStyle = "#000000";
    } else {
        // otherwise colour it according to the number
        // of iterations it took to get to infinity (threshold)
        const palette_num = document.getElementById('palette').value;
        ctx.fillStyle = colour_palettes[palette_num][iter % colour_palettes[palette_num].length];
    }
}

// draw the Mandelbrot Set
function draw_mandelbrot(ctx, max_iters, set_colour_func) {
    for (let iy = 0; iy < y_resolution; iy++) {
        const cy = imaginary_plan_minimum_value + iy * y_prop;

        for (let ix = 0; ix < x_resolution; ix++) {
            const cx = real_plane_minimum_value + ix * x_prop;
            const point = {x: 0.0, y: 0.0};
            const iter = compute_point(point, cx, cy, max_iters, threshold);

            set_colour_func(iter, max_iters, ctx, point);
            ctx.fillRect(ix, iy, 1, 1);
        }
    }
}

// draw a Julia set
function draw_julia(ctx, max_iters, set_colour_func) {
    const x_min = -2.25;
    const x_max = 2.25;
    const y_min = -1.8;
    const y_max = 1.8;

    const x_prop = (x_max - x_min) / (x_resolution - 1);
    const y_prop = (y_max - y_min) / (y_resolution - 1);

    const cx = Number(document.getElementById('cx').value);
    const cy = Number(document.getElementById('cy').value);

    for (let iy = 0; iy < y_resolution; iy++) {
        const y = y_min + iy * y_prop;

        for (let ix = 0; ix < x_resolution; ix++) {
            const point = {x: x_min + ix * x_prop, y: y};
            const iter = compute_point(point, cx, cy, max_iters, threshold);

            set_colour_func(iter, max_iters, ctx, point)
            ctx.fillRect(ix, iy, 1, 1);
        }
    }
}

function compute_point(point, cx, cy, maxiter, thresh) {
    let x2 = point.x * point.x;
    let y2 = point.y * point.y;
    let iter = 0;

    while ((iter < maxiter) && ((x2 + y2) < thresh)) {
        let temp = x2 - y2 + cx;
        point.y = 2 * point.x * point.y + cy;
        point.x = temp;
        x2 = point.x * point.x;
        y2 = point.y * point.y;
        iter++;
    }
    return iter;
}

function set_coords(evt, obj) {
    const x_pos = evt.clientX - obj.offsetLeft;
    const y_pos = evt.clientY - obj.offsetTop;

    const cx = real_plane_minimum_value + x_pos * x_prop;
    const cy = imaginary_plan_minimum_value + y_pos * y_prop;

    document.getElementById('cx').value = cx;
    document.getElementById('cy').value = cy;
}

function key_command_processor(e) {
    const evtobj = window.event ? event : e; //distinguish between IE's explicit event object (window.event) and Firefox's implicit.
    const unicode = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;
    const actualkey = String.fromCharCode(unicode);
    switch (actualkey) {
        case 'z':
            alert("zoom mode - coming soon");
            break;
        case 'c':
            alert("colour cycling mode - coming soon");
            break;
    }
}