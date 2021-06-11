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
import { Chart } from 'chart.js';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	public simulation: {
		value: number,
		result: number
	};
	public updates: {
		time: Date,
		type: 'insured' | 'event' | 'payout-long' | 'payout-short' | 'phase';
		description: string;
	}[];

	constructor() {
		this.updates = [
			{
				time: new Date(2019,12,1),
				type: 'phase',
				description: 'Contract deploy'
			},
			{
				time: new Date(2019,12,2),
				type: 'insured',
				description: 'New user insured (ITA, 15$)'
			},
			{
				time: new Date(2019,12,2),
				type: 'insured',
				description: 'New user insured (IND, 11$)'
			},
			{
				time: new Date(2019,12,2),
				type: 'insured',
				description: 'New user insured (ITA, 5$)'
			},
			{
				time: new Date(2019,12,3),
				type: 'insured',
				description: 'New user insured (USA, 7$)'
			},
			{
				time: new Date(2019,12,4),
				type: 'phase',
				description: 'Starting insured period'
			},
			{
				time: new Date(2019,12,6),
				type: 'event',
				description: 'Earthquake on ITA, 0 insured users affected'
			},
			{
				time: new Date(2019,12,8),
				type: 'event',
				description: 'Earthquake on IND, 1 insured users affected'
			},
			{
				time: new Date(2019,12,8),
				type: 'payout-short',
				description: 'Short term payouts to 1 users'
			}
		];
		this.updates = this.updates.reverse();

		this.simulation = {
			value: 10,
			result: 0
		};
		this.updateSimulation();
	}

	classOfUpdateType(t) {
		switch (t) {
			case 'insured':
				return 'badge-primary';
			case 'event':
				return 'badge-success';
			case 'payout-long':
				return 'badge-danger';
			case 'payout-short':
				return 'badge-warning';
			case 'phase':
				return 'badge-secondary';
		}
	}

	updateSimulation() {
		this.simulation.result = this.simulation.value * 10.391;
		return this.simulation.result;
	}

	ngOnInit() {
		// Set new default font family and font color to mimic Bootstrap's default styling
		Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
		Chart.defaults.global.defaultFontColor = '#858796';

		// Pie Chart Example
		var ctx = document.getElementById("myPieChart");
		var myPieChart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: ["Short term", "Long term", "Interests"],
				datasets: [{
					data: [55, 30, 15],
					backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
					hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
					hoverBorderColor: "rgba(234, 236, 244, 1)",
				}],
			},
			options: {
				maintainAspectRatio: false,
				tooltips: {
					backgroundColor: "rgb(255,255,255)",
					bodyFontColor: "#858796",
					borderColor: '#dddfeb',
					borderWidth: 1,
					xPadding: 15,
					yPadding: 15,
					displayColors: false,
					caretPadding: 10,
				},
				legend: {
					display: false
				},
				cutoutPercentage: 80,
			},
		});





		const number_format = (number, decimals?, dec_point?, thousands_sep?) => {
			// *     example: number_format(1234.56, 2, ',', ' ');
			// *     return: '1 234,56'
			number = (number + '').replace(',', '').replace(' ', '');
			var n = !isFinite(+number) ? 0 : +number,
				prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
				sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
				dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
				s: any = '',
				toFixedFix = function (n, prec) {
					var k = Math.pow(10, prec);
					return '' + Math.round(n * k) / k;
				};
			// Fix for IE parseFloat(0.55).toFixed(0) = 0;
			s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
			if (s[0].length > 3) {
				s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
			}
			if ((s[1] || '').length < prec) {
				s[1] = s[1] || '';
				s[1] += new Array(prec - s[1].length + 1).join('0');
			}
			return s.join(dec);
		}

		// // Bar Chart Example
		// var ctx = document.getElementById("myBarChart");
		// var myBarChart = new Chart(ctx, {
		// 	type: 'bar',
		// 	data: {
		// 		labels: ["January", "February", "March", "April", "May", "June"],
		// 		datasets: [{
		// 			label: "Revenue",
		// 			backgroundColor: "#4e73df",
		// 			hoverBackgroundColor: "#2e59d9",
		// 			borderColor: "#4e73df",
		// 			data: [4215, 5312, 6251, 7841, 9821, 14984],
		// 		}],
		// 	},
		// 	options: {
		// 		maintainAspectRatio: false,
		// 		layout: {
		// 			padding: {
		// 				left: 10,
		// 				right: 25,
		// 				top: 25,
		// 				bottom: 0
		// 			}
		// 		},
		// 		scales: {
		// 			xAxes: [{
		// 				time: {
		// 					unit: 'month'
		// 				},
		// 				gridLines: {
		// 					display: false,
		// 					drawBorder: false
		// 				},
		// 				ticks: {
		// 					maxTicksLimit: 6
		// 				},
		// 				maxBarThickness: 25,
		// 			}],
		// 			yAxes: [{
		// 				ticks: {
		// 					min: 0,
		// 					max: 15000,
		// 					maxTicksLimit: 5,
		// 					padding: 10,
		// 					// Include a dollar sign in the ticks
		// 					callback: function (value, index, values) {
		// 						return '$' + number_format(value);
		// 					}
		// 				},
		// 				gridLines: {
		// 					color: "rgb(234, 236, 244)",
		// 					zeroLineColor: "rgb(234, 236, 244)",
		// 					drawBorder: false,
		// 					borderDash: [2],
		// 					zeroLineBorderDash: [2]
		// 				}
		// 			}],
		// 		},
		// 		legend: {
		// 			display: false
		// 		},
		// 		tooltips: {
		// 			titleMarginBottom: 10,
		// 			titleFontColor: '#6e707e',
		// 			titleFontSize: 14,
		// 			backgroundColor: "rgb(255,255,255)",
		// 			bodyFontColor: "#858796",
		// 			borderColor: '#dddfeb',
		// 			borderWidth: 1,
		// 			xPadding: 15,
		// 			yPadding: 15,
		// 			displayColors: false,
		// 			caretPadding: 10,
		// 			callbacks: {
		// 				label: function (tooltipItem, chart) {
		// 					var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
		// 					return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
		// 				}
		// 			}
		// 		},
		// 	}
		// });


		// Area Chart Example
		var ctx = document.getElementById("myAreaChart");
		var myLineChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				datasets: [{
					yAxisID: 'volume',
					label: "Insured Volume",
					lineTension: 0.3,
					backgroundColor: "rgba(78, 115, 223, 0.05)",
					borderColor: "rgba(78, 115, 223, 1)",
					pointRadius: 3,
					pointBackgroundColor: "rgba(78, 115, 223, 1)",
					pointBorderColor: "rgba(78, 115, 223, 1)",
					pointHoverRadius: 3,
					pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
					pointHoverBorderColor: "rgba(78, 115, 223, 1)",
					pointHitRadius: 10,
					pointBorderWidth: 2,
					data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
				}, {
					yAxisID: 'users',
					label: "Insured Users",
					lineTension: 0.3,
					backgroundColor: "rgba(255, 115, 223, 0.05)",
					borderColor: "rgba(255, 115, 223, 1)",
					pointRadius: 3,
					pointBackgroundColor: "rgba(255, 115, 223, 1)",
					pointBorderColor: "rgba(255, 115, 223, 1)",
					pointHoverRadius: 3,
					pointHoverBackgroundColor: "rgba(255, 115, 223, 1)",
					pointHoverBorderColor: "rgba(255, 115, 223, 1)",
					pointHitRadius: 10,
					pointBorderWidth: 2,
					data: [0, 31, 20, 48, 35, 59, 63, 120, 172, 154, 257, 327],
				}, {
					yAxisID: 'events',
					label: "Disasters",
					lineTension: 0.3,
					backgroundColor: "rgba(55, 115, 23, 0.05)",
					borderColor: "rgba(55, 115, 23, 1)",
					pointRadius: 3,
					pointBackgroundColor: "rgba(55, 115, 23, 1)",
					pointBorderColor: "rgba(55, 115, 23, 1)",
					pointHoverRadius: 3,
					pointHoverBackgroundColor: "rgba(55, 115, 23, 1)",
					pointHoverBorderColor: "rgba(55, 115, 23, 1)",
					pointHitRadius: 10,
					pointBorderWidth: 2,
					data: [13, 9, 19, 44, 3, 7, 20, 15, 12, 6, 7, 2],
				}],
			},
			options: {
				maintainAspectRatio: false,
				layout: {
					padding: {
						left: 10,
						right: 25,
						top: 25,
						bottom: 0
					}
				},
				scales: {
					xAxes: [{
						time: {
							unit: 'date'
						},
						gridLines: {
							display: false,
							drawBorder: false
						},
						ticks: {
							maxTicksLimit: 7
						}
					}],
					yAxes: [{
						id: 'volume',
						ticks: {
							maxTicksLimit: 5,
							padding: 10,
							// Include a dollar sign in the ticks
							callback: function (value, index, values) {
								return '$' + number_format(value);
							}
						},
						gridLines: {
							color: "rgb(234, 236, 244)",
							zeroLineColor: "rgb(234, 236, 244)",
							drawBorder: false,
							borderDash: [2],
							zeroLineBorderDash: [2]
						}
					}, {
						id: 'users',
						ticks: {
							maxTicksLimit: 5,
							padding: 10,
							// Include a dollar sign in the ticks
							callback: function (value, index, values) {
								return number_format(value);
							}
						},
						gridLines: {
							color: "rgb(234, 236, 244)",
							zeroLineColor: "rgb(234, 236, 244)",
							drawBorder: false,
							borderDash: [2],
							zeroLineBorderDash: [2]
						}
					}, {
						id: 'events',
						ticks: {
							maxTicksLimit: 5,
							padding: 10,
							// Include a dollar sign in the ticks
							callback: function (value, index, values) {
								return number_format(value);
							}
						},
						gridLines: {
							color: "rgb(234, 236, 244)",
							zeroLineColor: "rgb(234, 236, 244)",
							drawBorder: false,
							borderDash: [2],
							zeroLineBorderDash: [2]
						}
					}],
				},
				legend: {
					display: true
				},
				tooltips: {
					backgroundColor: "rgb(255,255,255)",
					bodyFontColor: "#858796",
					titleMarginBottom: 10,
					titleFontColor: '#6e707e',
					titleFontSize: 14,
					borderColor: '#dddfeb',
					borderWidth: 1,
					xPadding: 15,
					yPadding: 15,
					displayColors: false,
					intersect: false,
					mode: 'index',
					caretPadding: 10,
					callbacks: {
						label: function (tooltipItem, chart) {
							var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
							return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
						}
					}
				}
			}
		});
	}
}
