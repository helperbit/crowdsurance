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

app.controller('raiseCtrl', [ '$rootScope', '$scope', function($rootScope, $scope) {
    $scope.event = {
        type: 0,
        cells: '[1,2]',
        intensity: 120
    };


	$scope.raise = function () {
		var ib = Insurbit.deployed();
		ib.raiseEvent (parseInt ($scope.event.type), eval ($scope.event.cells), parseInt ($scope.event.intensity), { gas: 3000000, from: $rootScope.accounts[0] }).then (function (tu) {
			alert ('Event raised correctly');
		}).catch (function (e) {
			console.log (e);
			alert ('Error while raising');
		});
	};
}]);
