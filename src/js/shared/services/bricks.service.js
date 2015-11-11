/**
 * Created by victorzaragoza on 09/11/2015.
 */
'use strict';
angular.module('shared.services.bricks', [])
    .factory('bricksService', function($q){

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

            saveBrick: function(coords, brick){
                console.log('Saving Object at: ', coords);
                console.log('Object: ', brick);
            }
        };
});
