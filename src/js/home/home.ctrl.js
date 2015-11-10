/**
 * Created by victorzaragoza on 09/11/2015.
 */
'use strict';
angular.module('Home')
    .controller('homeCtrl', ['$scope', 'Fabric', 'FabricConstants', 'Keypress', 'bricksService', '$window', '$timeout',
        function($scope, Fabric, FabricConstants, Keypress, bricksService, $window, $timeout) {

            $scope.windowWidth = document.documentElement.clientWidth;
            $scope.windowHeight = document.documentElement.clientHeight;
            $scope.fabric = {};
            $scope.FabricConstants = FabricConstants;
            $scope.bricks = [];
            console.log('Dentro de home');
            $scope.headerHeight = 50;
            $scope.canvasMargin = 0;

            bricksService.getBricks().then(function(bricks){
                $scope.bricks = bricks;
            });

            //
            // Creating Canvas Objects
            // ================================================================


            $scope.addImage = function(image) {
                $scope.fabric.addImage('img/13c6890.jpg');
            };

            //var brick = new $window.fabric.kanvas.Rect({
            //    left: 100,
            //    top: 100,
            //    fill: 'red',
            //    width: 20,
            //    height: 20
            //});
            //
            //$scope.fabric.addObjectToCanvas(brick);

            $scope.addRect = function() {

                $scope.fabric.addRect(100, 100, 'red', 20, 20);
            }
            //
            // Editing Canvas Size
            // ================================================================
            $scope.selectCanvas = function() {
                $scope.canvasCopy = {
                    width: $scope.fabric.canvasOriginalWidth,
                    height: $scope.fabric.canvasOriginalHeight
                };
                $scope.canvasCopy.width = $scope.windowWidth - $scope.canvasMargin;
                $scope.canvasCopy.height = $scope.windowHeight - $scope.headerHeight;
                $scope.setCanvasSize();
            };

            $scope.setCanvasSize = function() {
                $scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
                $scope.fabric.setDirty(true);
                delete $scope.canvasCopy;
            };
            //====================================================
            //
            //

            //
            // Init
            // ================================================================
            $scope.init = function() {
                $scope.fabric = new Fabric({
                    JSONExportProperties: FabricConstants.JSONExportProperties,
                    textDefaults: FabricConstants.textDefaults,
                    shapeDefaults: FabricConstants.shapeDefaults,
                    json: {}
                });
                $scope.fabric.setCanvasSize($scope.windowWidth - $scope.canvasMargin, $scope.windowHeight - $scope.headerHeight);
                $scope.run = true;
            };

            $scope.$on('canvas:created', $scope.init);
            //====================================================
            //
            //

            //
            //
            // Resize browser
            //====================================================
            $scope.$watch($scope.windowWidth, function(){
                if ($scope.run)
                    $scope.initializeCanvas();
            });

            $scope.$watch($scope.windowHeight, function(){
                if ($scope.run)
                    $scope.initializeCanvas();
            });

            $scope.initializeCanvas = function(){
                $scope.fabric.setCanvasSize($scope.windowWidth - $scope.canvasMargin, $scope.windowHeight - $scope.headerHeight);
            };

            $(window).on('resize.doResize', function () {
                var newWidth = window.innerWidth,
                    updateCanvasDimensions;
                var newHeight = window.innerHeight,
                    updateCanvasDimensions;

                if (newHeight !== $scope.windowHeight){
                    $timeout.cancel(updateCanvasDimensions);
                }

                if (newWidth !== $scope.windowWidth) {
                    $timeout.cancel(updateCanvasDimensions);
                }

                updateCanvasDimensions = $timeout(function() {
                    $scope.windowWidth = newWidth;
                    $scope.windowHeight = newHeight;
                    $scope.fabric.setCanvasSize($scope.windowWidth - $scope.canvasMargin, $scope.windowHeight - $scope.headerHeight);
                }, 200);
            });

            $scope.$on('$destroy',function (){
                $(window).off('resize.doResize'); // remove the handler added earlier
            });
            //====================================================
            //
            //

    }]);
