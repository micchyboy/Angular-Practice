angular.module("sportsStore")
    .controller("productDetailsCtrl", function ($scope, $interval) {

        $scope.convertToActualSize = function (thumbnail) {
            var thumbPath = "/images/thumbnails";
            return thumbnail.replace(thumbPath, "/images/actual-size");
        }

        $scope.$watch("util.currentProduct.thumbnailImages", function () {
            $scope.currentProductImages = $scope.util.currentProduct.thumbnailImages;
            if ($scope.photoInterval.interval) {
                $scope.photoInterval.end();
            }
            if ($scope.currentProductImages.length > 1) {
                $scope.photoInterval.start();
            }

            $scope.currentImage = $scope.convertToActualSize($scope.util.currentProduct.primaryImage);
        });

//        $scope.currentProductImages = $scope.util.currentProduct.thumbnailImages;
//
//        $scope.currentImage = $scope.convertToActualSize($scope.currentProductImages[0]);

        $scope.isCurrentImage = function (image) {
            return $scope.convertToActualSize(image) == $scope.currentImage;
        }

        $scope.photoInterval = {
            start: function () {
                /*$scope.selectThumbnail = function (image) {
                    $scope.currentImage = $scope.convertToActualSize(image);
                }*/

                $scope.selectUp = function () {
                    shiftArrayLeft($scope.currentProductImages);

                }

                $scope.selectDown = function () {
                    shiftArrayRight($scope.currentProductImages);
                }


                var i = 0;
                $scope.photoInterval.interval = $interval(function () {
                    shiftArrayRight($scope.currentProductImages);
                    $scope.currentImage = $scope.convertToActualSize($scope.currentProductImages[i]);

                }, 4000);
            },

            end: function () {
                $interval.cancel($scope.photoInterval.interval);
            }
        }


        function shiftArrayRight(arr) {
            var item = arr.shift();
            arr[arr.length] = item;
        }


        function shiftArrayLeft(arr) {
            var item = arr.pop();
            arr.unshift(item)
        }
    }).directive("modalGallery", function ($compile) {
        console.log("Entered modal directive");
        return {
            scope: true,
            link: function (scope, element, attrs) {

                scope.calculateLeftDistance = function (index) {
                    scope.leftDistance = "-" + (index * 100) + "%"
                }

                scope.$watch("util.currentProduct.thumbnailImages", function () {
                    scope.productImages = scope.util.currentProduct.thumbnailImages.slice();
                    scope.galleryImages = scope.util.currentProduct.galleryImages.slice();
                })
                function initialize(){
                    scope.ulWidth = (scope.productImages.length * 100) + "%";
                    scope.liWidth = (100 / scope.productImages.length) + "%";
                    scope.leftDistance = 0 + "%";
                }


                element.on('click', function () {
                    initialize();
                    console.log(scope.productImages);
                    scope.$apply(function () {
                        scope.src = scope.currentImage;
                        console.log(scope.productImages.length);
                        var content = document.querySelector("#galleryTemplate").outerText;
                        var listElem = angular.element(content);
                        var compileFn = $compile(listElem);
                        compileFn(scope);

                        console.log("List Element: " + listElem)

                        $('#myModal').modal();
                        $('#myModal').on('shown.bs.modal', function () {
                            $('#myModal .modal-body').html(listElem[0]);
                        });
                        $('#myModal').on('hidden.bs.modal', function () {
                            $('#myModal .modal-body').html('');
                        });
                    })

                });
            }
        }
    });
