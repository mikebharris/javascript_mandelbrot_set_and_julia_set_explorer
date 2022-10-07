//
// JavaScript methods to draw Mandelbrot and Julia Sets
//
// Written by mike@mbharris.co.uk
//
// version 1.2 - featuring LSM and BDM methods, iterations slider and auto draw julia set mode
//
// (c) 2009-2015 Mike Harris.  
// Free software released under GNU Public Licence v2.0.
//

// set up a colour colour_palette for colouring the levels outside the set itself
const colour_pallette = ["#000033", "#000066", "#000099", "#0000CC", "#0000FF", "#330000", "#330033", "#330066", "#330099", "#3300CC", "#660000", "#660033", "#660066", "#660099", "#6600CC", "#6600FF", "#990033", "#990066", "#990099", "#9900CC", "#9900FF", "#CC0033", "#CC0066", "#CC00CC", "#CC00FF", "#FF00FF"];
const number_of_colours = colour_pallette.length;

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

const maxiter = 60;      // maximum number of iterations
const threshold = 10000.00; // threashold above which value is considered to tend to infinity
// the coloured bands on the outside of our Mandelbrot Set are
// a measure of how soon the values become unstable and hence the
// point on the plane is not within the set itself, not bounded by the set

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

// divide and conquer box method
function box(ox, oy, dx, dy) {
    var colour_change = 0;
    var colour = 0;

    for (var ix = ox; ix < dx; ix++) {
        var point = {x: 0.0, y: 0.0};
        var cx = real_plane_minimum_value + ix * x_prop;
        var cy = oy * y_prop; // top edge

        colour = compute_and_plot_point(point, cx, cy, maxiter, threshold);
        if (old_colour != colour) {
            colour_change = 1
        }
        ;

        var cy = dy * y_prop; // bottom edge
        colour = compute_and_plot_point(point, cx, cy, maxiter, threshold);
        if (old_colour != colour) {
            colour_change = 1
        }
        ;
    }

    for (var iy = oy; iy < dy; iy++) {
        var point = {x: 0.0, y: 0.0};
        var cy = imaginary_plan_minimum_value + iy * y_prop;
        var cx = ox * x_prop; // left edge
        colour = compute_and_plot_point(point, cx, cy, maxiter, threshold);
        if (old_colour != colour) {
            colour_change = 1
        }
        ;

        var cx = dx * x_prop; // right edge
        colour = compute_and_plot_point(point, cx, cy, maxiter, threshold);
        if (old_colour != colour) {
            colour_change = 1
        }
        ;
    }

    if (colour_change == 0) {
        // conquer
        ctx.fillRect(ox, oy, dx, dy);
    } else {
        if (dx > dy) {
            // wider, split into two verticaly
            box(ox, oy, dx / 2, dy); // left half
            box(dx / 2, oy, dx, dy); // right half
        } else {
            // taller, split horizontaly
            box(ox, oy, dx, dy / 2); // top half
            box(ox, dy / 2, dx, dy); // bottom half
        }
    }
}

function mandelbrot() {
    const method = document.getElementById('method').value;
    const maxiter = document.getElementById('iterations').value;
    switch (method) {
        case 'bdm':
            mandelbrot_bdm(maxiter);
            break;
        case 'lsm':
        default:
            mandelbrot_lsm(maxiter);
            break;
    }
}

// draw the mandelbrot set using the Level Set Method
function mandelbrot_lsm(maxiter) {
    const canvas = document.getElementById("mset_canvas");
    const ctx = canvas.getContext("2d");

    for (let iy = 0; iy < y_resolution; iy++) {

        const cy = imaginary_plan_minimum_value + iy * y_prop;

        for (let ix = 0; ix < x_resolution; ix++) {

            const cx = real_plane_minimum_value + ix * x_prop;
            const point = {x: 0.0, y: 0.0};
            const iter = compute_point(point, cx, cy, maxiter, threshold);

            if (iter == maxiter) {
                // if we didn't get to infinity by the time we
                // used up all the iterations, then we're in the set
                // colour it bloack
                ctx.fillStyle = "#000000";
            } else {
                // otherwise colour it according to the number
                // of iterations it took to get to infinity (threshold)
                ctx.fillStyle = colour_pallette[iter % number_of_colours];
            }
            ctx.fillRect(ix, iy, 1, 1);
        }
    }
}

// draw the Mandelbrot Set using the Binary Decomposition Method
function mandelbrot_bdm(maxiter) {
    const canvas = document.getElementById("mset_canvas");
    const ctx = canvas.getContext("2d");

    for (let iy = 0; iy < y_resolution; iy++) {

        const cy = imaginary_plan_minimum_value + iy * y_prop;

        for (let ix = 0; ix < x_resolution; ix++) {

            const cx = real_plane_minimum_value + ix * x_prop;
            const point = {x: 0.0, y: 0.0};
            const iter = compute_point(point, cx, cy, maxiter, threshold);

            if (iter == maxiter) {
                // if we didn't get to infinity by the time we
                // used up all the iterations, then we're in the set
                // colour it black
                ctx.fillStyle = "#000000";
            } else {
                // color it depending on the angle of alpha
                var alpha = Math.atan(point.y);
                if ((alpha >= 0) && (alpha <= 3)) {
                    ctx.fillStyle = "#fff";
                } else {
                    ctx.fillStyle = "#000";
                }
            }
            ctx.fillRect(ix, iy, 1, 1);
        }
    }
}

function julia() {
    const method = document.getElementById("method").value;
    const maxiter = document.getElementById('iterations').value;
    switch (method) {
        case 'bdm':
            julia_bdm(maxiter);
            break;
        case 'lsm':
        default:
            julia_lsm(maxiter);
            break;
    }
}

// draw a Julia set using the Level Set Method
function julia_lsm(maxiter) {
    const canvas = document.getElementById("jset_canvas");
    const ctx = canvas.getContext("2d");
    const color_method = "lsm";

    const x_min = -2.25;
    const x_max = 2.25;
    const y_min = -1.8;
    const y_max = 1.8;

    const x_prop = (x_max - x_min) / (x_resolution - 1);
    const y_prop = (y_max - y_min) / (y_resolution - 1);

    // note these must use the Number object to 'cast' the
    // values to numbers (rather than strings)
    const cx = Number(document.getElementById('cx').value);
    const cy = Number(document.getElementById('cy').value);

    for (let iy = 0; iy < y_resolution; iy++) {

        const y = y_min + iy * y_prop;
        for (let ix = 0; ix < x_resolution; ix++) {

            const point = {x: x_min + ix * x_prop, y: y};
            const iter = compute_point(point, cx, cy, maxiter, threshold);

            if (iter == maxiter) {
                // if we didn't get to infinity by the time we
                // used up all the iterations, then we're in the set
                // colour it black
                ctx.fillStyle = "#000000";
            } else {
                // otherwise colour it according to the number
                // of iterations it took to get to infinity (threshold)
                ctx.fillStyle = colour_pallette[iter % number_of_colours];
            }

            ctx.fillRect(ix, iy, 1, 1);
        }
    }
}

function julia_bdm(maxiter) {
    const canvas = document.getElementById("jset_canvas");
    const ctx = canvas.getContext("2d");

    const x_min = -2.25;
    const x_max = 2.25;
    const y_min = -1.8;
    const y_max = 1.8;

    const x_prop = (x_max - x_min) / (x_resolution - 1);
    const y_prop = (y_max - y_min) / (y_resolution - 1);

    // note these must use the Number object to 'cast' the
    // values to numbers (rather than strings)
    const cx = Number(document.getElementById('cx').value);
    const cy = Number(document.getElementById('cy').value);

    for (let iy = 0; iy < y_resolution; iy++) {

        const y = y_min + iy * y_prop;
        for (let ix = 0; ix < x_resolution; ix++) {

            const point = {x: x_min + ix * x_prop, y: y};
            const iter = compute_point(point, cx, cy, maxiter, threshold);

            if (iter == maxiter) {
                // if we didn't get to infinity by the time we
                // used up all the iterations, then we're in the set
                // colour it bloack
                ctx.fillStyle = "#000000";
            } else {
                // color it depending on the angle of alpha
                var alpha = Math.atan(point.y);
                if ((alpha >= 0) && (alpha <= 3)) {
                    ctx.fillStyle = "#fff";
                } else {
                    ctx.fillStyle = "#000";
                }
            }

            ctx.fillRect(ix, iy, 1, 1);
        }
    }
}

function set_coords(evt, obj) {
    const x_pos = evt.clientX - obj.offsetLeft;
    const y_pos = evt.clientY - obj.offsetTop;

    const cx = real_plane_minimum_value + x_pos * x_prop;
    const cy = imaginary_plan_minimum_value + y_pos * y_prop;

    document.getElementById('cx').value = cx;
    document.getElementById('cy').value = cy;
}

// not currently used
function dcg_section(x0, y0, width, height) {

    var x1;
    var y1;
    var x_mid;
    var y_mid;

    var mono = true;

    // get colour of point (x0, y0)
    // col = ptst(x0,y0)

    x1 = x0 + width - 1;
    y1 = y0 + height - 1;
    x_mid = x0 + width % 2;
    y_mid = y0 + height % 2;
}

function key_command_processor(e) {
    const evtobj = window.event ? event : e; //distinguish between IE's explicit event object (window.event) and Firefox's implicit.
    const unicode = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;
    const actualkey = String.fromCharCode(unicode);
    if (actualkey == "z") {
        alert("zoom mode - coming soon");
    }
}
