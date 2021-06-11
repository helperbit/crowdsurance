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

app.controller('insureCtrl', [ '$rootScope', '$scope', function($rootScope, $scope) {
	$scope.user = {
		address: '',
		cell: 0,
		amount: 0
	};

	$scope.insure = function () {
		var ib = Insurbit.deployed();
		ib.insure.sendTransaction (parseInt ($scope.user.cell), $scope.user.address, { gas: 3000000, from: $rootScope.accounts[0], value: web3.toWei (parseInt ($scope.user.amount), 'ether') }).then (function (tu) {
			alert ('User insured correctly');
		}).catch (function (e) {
			console.log (e);
			alert ('Error while insuring');
		});
	};
}]);
