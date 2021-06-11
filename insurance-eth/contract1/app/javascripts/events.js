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

app.controller('eventsCtrl', [ '$rootScope', '$scope', '$timeout', '$interval', function($rootScope, $scope, $timeout, $interval) {
    $scope.events = [];
    $scope.eventn = 0;

    $scope.update = function () {
        var ib = Insurbit.deployed();
        ib.totalEvents.call($rootScope.account).then(function(value) {
            $scope.eventn = value.valueOf();
            $scope.events = [];

            for (var i = 0; i < $scope.eventn; i++) {
                ib.events.call(i, $rootScope.account).then(function(value) {
                    $scope.events.push ({
                        timestamp: value[0].valueOf () * 1000,
                        type: value[1].valueOf (),
                        intensity: value[2].valueOf (),
                        distributed: web3.fromWei (value[3].valueOf (), 'ether'),
                        affected: value[4].valueOf ()
                    });
                });
            }
        }).catch(function(e) {
            console.log(e);
        });
    };

    $timeout ($scope.update, 2000);
    $interval ($scope.update, 15000);

}]);
