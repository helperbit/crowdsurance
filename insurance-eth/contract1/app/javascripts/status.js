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

app.controller('statusCtrl', [ '$rootScope', '$scope', '$interval', function($rootScope, $scope, $interval) {
    $scope.status = {
      totalUsers: 0,
      totalEvents: 0,
      totalInsuredAmount: 0,
      elapsedInsuredAmount: 0,
      intensitySum: 0,
      status: 0
    };

    $scope.update = function () {
        console.log ('update');
        var ib = Insurbit.deployed();

        ib.totalUsers.call($rootScope.account).then(function(value) {
            $scope.status.totalUsers = value.valueOf();
        }).catch(function(e) {
            console.log(e);
        });

        ib.totalInsuredAmount.call($rootScope.account).then(function(value) {
            $scope.status.totalInsuredAmount = web3.fromWei (value.valueOf(), 'ether');
        }).catch(function(e) {
            console.log(e);
        });

        ib.elapsedInsuredAmount.call($rootScope.account).then(function(value) {
            $scope.status.elapsedInsuredAmount = web3.fromWei (value.valueOf(), 'ether');
        }).catch(function(e) {
            console.log(e);
        });

        ib.totalEvents.call($rootScope.account).then(function(value) {
            $scope.status.totalEvents = value.valueOf();
        }).catch(function(e) {
            console.log(e);
        });

        ib.contractStatus.call($rootScope.account).then(function(value) {
            $scope.status.status = value.valueOf();
        }).catch(function(e) {
            console.log(e);
        });

        ib.intensitySum.call($rootScope.account).then(function(value) {
            $scope.status.intensitySum = value.valueOf();
        }).catch(function(e) {
            console.log(e);
        });
    };

    $scope.update ();
    $interval ($scope.update, 10000);
}]);