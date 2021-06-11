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

import { Polygon, Point, FeatureCollection } from '@turf/helpers';


declare class Hexagon {
	hexagonData: FeatureCollection;
	hexagons: number;

	constructor(cellSide: number);

	/** transforms p to its hexagon index */
	ofPoint(p: Point): number;

	/** transforms the i hexagon index to a point (center of hexagon) */
	toPoint(i: number): Point;

	/** transforms the p polygon to a list of hexagon index */
	ofPolygon(p: Polygon): number[];

	/** transforms i hexagon indexes to a polygon (as concatenation of hexagon) */
	toPolygon(i: number[]): Polygon;
}

