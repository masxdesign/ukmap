(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.polylabel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Queue = require('tinyqueue');
module.exports = polylabel;
function polylabel(P, precision, debug) {
    precision = precision || 1.0;
    // find the bounding box of the outer ring
    var minX, minY, maxX, maxY;
    for (var i = 0; i < P[0].length; i++) {
        var p = P[0][i];
        if (!i || p[0] < minX) minX = p[0];
        if (!i || p[1] < minY) minY = p[1];
        if (!i || p[0] > maxX) maxX = p[0];
        if (!i || p[1] > maxY) maxY = p[1];
    }

    var width = maxX - minX;
    var height = maxY - minY;
    var cellSize = Math.min(width, height);
    var h = cellSize / 2;

    // a priority queue of cells in order of their "potential" (max distance to polygon)
    var cellQueue = new Queue(null, compareMax);

    // cover polygon with initial cells
    for (var x = minX; x < maxX; x += cellSize) {
        for (var y = minY; y < maxY; y += cellSize) {
            cellQueue.push(new Cell(x + h, y + h, h, P));
        }
    }

    // take centroid as the first best guess
    var bestCell = getCentroidCell(P);
    var numProbes = cellQueue.length;

    while (cellQueue.length) {
        // pick the most promising cell from the queue
        var cell = cellQueue.pop();

        // update the best cell if we found a better one
        if (cell.d > bestCell.d) {
            bestCell = cell;
            if (debug) console.log('found best %d after %d probes', Math.round(1e4 * cell.d) / 1e4, numProbes);
        }

        // do not drill down further if there's no chance of a better solution
        if (cell.max - bestCell.d <= precision) continue;

        // split the cell into four cells
        h = cell.h / 2;
        cellQueue.push(new Cell(cell.x - h, cell.y - h, h, P));
        cellQueue.push(new Cell(cell.x + h, cell.y - h, h, P));
        cellQueue.push(new Cell(cell.x - h, cell.y + h, h, P));
        cellQueue.push(new Cell(cell.x + h, cell.y + h, h, P));
        numProbes += 4;
    }

    if (debug) {
        console.log('num probes: ' + numProbes);
        console.log('best distance: ' + bestCell.d);
    }

    return [bestCell.x, bestCell.y];
}

function compareMax(a, b) {
    return b.max - a.max;
}

function Cell(x, y, h, P) {
    this.x = x; // cell center x
    this.y = y; // cell center y
    this.h = h; // half the cell size
    this.d = pointToPolygonDist(x, y, P); // distance from cell center to polygon
    this.max = this.d + this.h * Math.SQRT2; // max distance to polygon within a cell
}
// signed distance from point to polygon outline (negative if point is outside)
function pointToPolygonDist(x, y, P) {
    var inside = false, minDistSq = Infinity, k = 0;
    for (k; k < P.length; k++) {
        var ring = P[k];
        for (var i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
            var a = ring[i];
            var b = ring[j];
            if ((a[1] > y !== b[1] > y) &&
                (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) inside = !inside;

            minDistSq = Math.min(minDistSq, getSegDistSq(x, y, a, b));
        }
    }

    return (inside ? 1 : -1) * Math.sqrt(minDistSq);
}
function getCentroidCell(P, a, b, f) {
    var A = 0, x = 0, y = 0, points = P[0], i = 0, l = points.length, j = l - 1;
    for (i, l, j; i < l; j = i++) {
        a = points[i];
        b = points[j];
        f = a[0] * b[1] - b[0] * a[1];
        x += (a[0] + b[0]) * f;
        y += (a[1] + b[1]) * f;
        A += f * 3;
    }
    return new Cell(x / A, y / A, 0, P);
}
// get squared distance from a point to a segment
function getSegDistSq(px, py, a, b) {
    var x = a[0];
    var y = a[1];
    var dx = b[0] - x;
    var dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
        var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) {
            x = b[0];
            y = b[1];
        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }
    dx = px - x;
    dy = py - y;
    return dx * dx + dy * dy;
}
}, { "tinyqueue": 2}], 2: [function (require, module, exports) {
    'use strict'; module.exports = TinyQueue;
function TinyQueue(data, compare) {
    if (!(this instanceof TinyQueue)) return new TinyQueue(data, compare);

    this.data = data || [];
    this.length = this.data.length;
    this.compare = compare || defaultCompare;

    if (data) for (var i = Math.floor(this.length / 2); i >= 0; i--) this._down(i);
}
function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
TinyQueue.prototype = {
    push: function (item) {
        this.data.push(item);
        this.length++;
        this._up(this.length - 1);
    },
    pop: function () {
        var top = this.data[0];
        this.data[0] = this.data[this.length - 1];
        this.length--;
        this.data.pop();
        this._down(0);
        return top;
    },
    peek: function () {
        return this.data[0];
    },
    _up: function (pos) {
        var data = this.data,
            compare = this.compare;

        while (pos > 0) {
            var parent = Math.floor((pos - 1) / 2);
            if (compare(data[pos], data[parent]) < 0) {
                swap(data, parent, pos);
                pos = parent;

            } else break;
        }
    },
    _down: function (pos) {
        var data = this.data,
            compare = this.compare,
            len = this.length;

        while (true) {
            var left = 2 * pos + 1,
                right = left + 1,
                min = pos;

            if (left < len && compare(data[left], data[min]) < 0) min = left;
            if (right < len && compare(data[right], data[min]) < 0) min = right;

            if (min === pos) return;

            swap(data, min, pos);
            pos = min;
        }
    }
};
function swap(data, i, j) {
    var tmp = data[i];
    data[i] = data[j];
    data[j] = tmp;
}
},{}]},{},[1])(1)});