/**
 * Created by victorzaragoza on 09/11/2015.
 */
'use strict';
angular.module('shared.services.bricks', [])
    .factory('bricksService', function($q, baseRoute, $http, $injector){

        function _createBrick(coords, innerObject){
            var brick = {};
            brick.coordinates = [];
            brick.coordinates.push(coords.lat);
            brick.coordinates.push(coords.long);
            brick.object = innerObject;
            brick.type = 'Point';
            return brick;
        }

        function _saveBrick(brick){
            var deferred = $q.defer(),
                $http = $injector.get('$http');

            $http({method: 'POST',
                url: baseRoute.apiRoute() + '/bricks',
                data: brick,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(
                    function(response){
                        deferred.resolve(response.data);
                    },
                    function(response){
                        deferred.reject(response.data);
                    });

            return deferred.promise;
        }

        return {

            getBricks: function(){
                var defer = $q.defer();

                var mockdata = [{
                    id: 'id1', name:'name1'
                },{
                    id: 'id2', name:'name2'
                }
                ];

                defer.resolve(mockdata);

                return defer.promise;
            },

            createBrick: _createBrick,

            saveBrick: _saveBrick


    };
});
