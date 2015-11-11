/**
 * Created by victorzaragoza on 09/11/2015.
 */
'use strict';
angular.module('Home', [])
    .config(function($stateProvider){
        $stateProvider.state('home', {
            url: '/home',
            controllerAs: 'home',
            templateUrl: '_home.html',
            controller: 'homeCtrl'
        });
    });
