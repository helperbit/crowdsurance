/* 
 *  Helperbit: a p2p donation platform (crowdsurance)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Hexagon = void 0;
var hex_grid_1 = require("@turf/hex-grid");
var boolean_contains_1 = require("@turf/boolean-contains");
var centroid_1 = require("@turf/centroid");
var helpers_1 = require("@turf/helpers");
var Hexagon = /** @class */ (function () {
    function Hexagon(cellSide) {
        if (cellSide === void 0) { cellSide = 25; }
        this.hexagonData = null;
        this.hexagons = 0;
        var options = { units: 'kilometers' };
        var wgrid = hex_grid_1["default"]([-180, -90, 0, 90], cellSide, options);
        var egrid = hex_grid_1["default"]([0, -90, 180, 90], cellSide, options);
        wgrid.features.concat(egrid.features);
        wgrid.features = wgrid.features.map(function (v, i) { return (__assign(__assign({}, v), { properties: { index: i } })); });
        this.hexagons = wgrid.features.length;
        this.hexagonData = wgrid;
    }
    /** transforms p to its hexagon index */
    Hexagon.prototype.ofPoint = function (p) {
        for (var _i = 0, _a = this.hexagonData.features; _i < _a.length; _i++) {
            var pol = _a[_i];
            if (boolean_contains_1["default"](pol, helpers_1.point(p))) {
                return pol.properties.index;
            }
        }
        return -1;
    };
    /** transforms the i hexagon index to a point (center of hexagon) */
    Hexagon.prototype.toPoint = function (i) {
        return centroid_1["default"](this.hexagonData.features[i]).geometry.coordinates;
    };
    /** transforms the p polygon to a list of hexagon index */
    Hexagon.prototype.ofPolygon = function (p) {
        return [];
    };
    /** transforms i hexagon indexes to a polygon (as concatenation of hexagon) */
    Hexagon.prototype.toPolygon = function (i) {
        return;
    };
    return Hexagon;
}());
exports.Hexagon = Hexagon;
var ch = new Hexagon(2048);
console.log('Hexagons:', ch.hexagons);
console.log(ch.ofPoint([0, 0]));
