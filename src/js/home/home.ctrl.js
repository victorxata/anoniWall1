/**
 * Created by victorzaragoza on 09/11/2015.
 */
'use strict';
angular.module('Home')
    .controller('homeCtrl', ['$scope', 'Fabric', 'FabricConstants', 'Keypress', 'bricksService', '$window', '$timeout', 'geolocation',
        function($scope, Fabric, FabricConstants, Keypress, bricksService, $window, $timeout, geolocation) {

            geolocation.getLocation().then(function(data){
                $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
                console.log($scope.coords);

            });

            $scope.windowWidth = document.documentElement.clientWidth;
            $scope.windowHeight = document.documentElement.clientHeight;
            $scope.fabric = {};
            $scope.FabricConstants = FabricConstants;
            $scope.bricks = [];
            console.log('Dentro de home');
            $scope.headerHeight = 75;
            $scope.canvasMargin = 0;

            $scope.objects = [];

            //
            // Creating Canvas Objects
            // ================================================================


            $scope.addImage = function() {
                var image = $scope.fabric.addImage('img/13c6890.jpg', function(object){
                    $scope.objects.push(object);
                    console.log('selected image: ', object.id);
                    console.log('objects: ', $scope.objects);
                });
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

                var rect = $scope.fabric.addRect(100, 100, 'red', 40, 40, function(object){
                    $scope.objects.push(object);
                    console.log('selected rect: ', object.id);
                    console.log('objects: ', $scope.objects);
                });

            };

            $scope.addText = function(){
                $scope.fabric.addText('New Text', function(object){
                    $scope.objects.push(object);
                    console.log('selected text: ', object.id);
                    console.log('objects: ', $scope.objects);
                });
            };
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


                bricksService.getBricks().then(function(bricks){
                    $scope.bricks = bricks;
                });
            };

            $scope.$on('canvas:created', $scope.init);

            bricksService.getBricks().then(function(bricks){
                $scope.bricks = bricks;
            });

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

            $scope.save = function(){

                angular.forEach($scope.objects, function(object){
                    bricksService.saveBrick($scope.coords, object);
                });

                $scope.fabric.setDirty(false);
            };

            $scope.cancel = function(){
                $scope.fabric.deleteActiveObject();
                $scope.fabric.setDirty(false);
            };

            $scope.grayscale = false;


            $scope.setToGrayscale = function(){
                if ($scope.grayscale === true) {
                    $scope.fabric.setToGrayscale($scope.fabric.selectedObject);
                } else{
                    $scope.fabric.setToColor($scope.fabric.selectedObject);
                }
            }

    }]);
