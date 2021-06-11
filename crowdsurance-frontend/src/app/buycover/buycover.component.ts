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

import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, Layer, marker, icon } from 'leaflet';

@Component({
  selector: 'app-buycover',
  templateUrl: './buycover.component.html',
  styleUrls: ['./buycover.component.scss']
})
export class BuycoverComponent implements OnInit {
  public mapOptions: any;
  public markers: Layer[] = [];

  constructor() {
    this.markers = [marker(
			[ 46.879966 + 0.1 * (Math.random() - 0.5), -121.726909 + 0.1 * (Math.random() - 0.5) ],
			{
				icon: icon({
					iconSize: [ 25, 41 ],
					iconAnchor: [ 13, 41 ],
					iconUrl: 'assets/marker-icon.png',
					shadowUrl: 'assets/marker-shadow.png'
				})
			}
		)]
    this.mapOptions = {
      layers: [
        tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: latLng(46.879966, -121.726909)
    };
  }

  ngOnInit() {
  }

}
