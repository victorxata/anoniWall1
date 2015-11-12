/**
 * Created by victorzaragoza on 10/11/2015.
 */
'use strict';
angular.module('shared.models.BricksModel', [])
    .factory('BricksModel', function($q, baseRoute, $injector){

        var type = 'Point';
        var coordinates = [];
        var object;

        function _createBrick(coords, innerObject){
            coordinates[0] = coords.lat;
            coordinates[1] = coords.long;
            object = innerObject;
            type = 'Point';
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


        Bricks.createBrick = _createBrick;
        Bricks.saveBrick = _saveBrick;

        return Bricks;

    });
