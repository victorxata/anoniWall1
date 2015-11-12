/**
 * Created by victorzaragoza on 09/11/2015.
 */
'use strict';
angular.module('anoniWall', [
    'ui.router',
    'common.fabric',
    'common.fabric.constants',
    'common.fabric.utilities',
    'geolocation',
    'Home',
    'shared.services.bricks',
    'shared.models.BricksModel',
    'common.shared'
])
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/home');
    });
