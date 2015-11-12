/**
 * Created by victorzaragoza on 12/11/2015.
 */
'use strict';
angular.module('common.shared', [] )
    .provider('baseRouteConfig', function(){
        this.baseRoute = {
        };

        this.$get = function () {
            return {
                baseRoute: this.baseRoute
            };
        };
    })
    .factory('baseRoute', function($location){

        function apiRoute() {
            var apiroute = 'http://192.168.192.37:10436';
            return apiroute;
        }

        function webRoute() {
            var webroute = $location.protocol() + '://' + $location.host() + ':'+ $location.port();
            return webroute;
        }

        var service = {
            apiRoute: apiRoute,
            webRoute: webRoute,
            hasBase:function(route){
                return route.search($location.host()) > -1;
            }
        };
        return service;
    });
