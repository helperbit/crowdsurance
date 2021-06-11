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

import hexGrid from '@turf/hex-grid';
import booleanContains from '@turf/boolean-contains';
import centroid from '@turf/centroid';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Position, Geometry, Feature, BBox, Polygon, point, Point, Units, FeatureCollection } from '@turf/helpers';


export class Hexagon {
	hexagonData: FeatureCollection = null;
	hexagons: number = 0;

	constructor(cellSide: number = 25) {
		const options = { units: 'kilometers' as Units };

		var wgrid = hexGrid([-180, -90, 0, 90] as BBox, cellSide, options);
		var egrid = hexGrid([0, -90, 180, 90] as BBox, cellSide, options);
		wgrid.features.concat(egrid.features);
		wgrid.features = wgrid.features.map((v, i) => ({ ...v, ...{ properties: { index: i } } }));
		this.hexagons = wgrid.features.length;
		this.hexagonData = wgrid;
	}

	/** transforms p to its hexagon index */
	ofPoint(p: Position): number {
		for (let pol of this.hexagonData.features) {
			if (booleanContains(pol, point(p))) {
				return pol.properties.index;
			}
		}
		return -1;
	}

	/** transforms the i hexagon index to a point (center of hexagon) */
	toPoint(i: number): Position {
		return centroid(this.hexagonData.features[i]).geometry.coordinates;
	}

	/** transforms the p polygon to a list of hexagon index */
	ofPolygon(p: Polygon): number[] {
		return [];
	}

	/** transforms i hexagon indexes to a polygon (as concatenation of hexagon) */
	toPolygon(i: number[]): Polygon {
		return;
	}
}


const ch = new Hexagon(2048);
console.log('Hexagons:', ch.hexagons);
console.log(ch.ofPoint([0, 0]));