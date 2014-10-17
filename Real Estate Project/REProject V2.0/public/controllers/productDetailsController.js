angular.module("sportsStore")
    .controller("productDetailsCtrl", function ($scope, $interval) {

        $scope.convertToActualSize = function(thumbnail){
            var thumbPath = "/images/thumbnails";
            return thumbnail.replace(thumbPath, "/images/actual-size");
        }

        $scope.$watch("util.currentProduct.images",  function(){
            $scope.currentProductImages = $scope.util.currentProduct.images;
            if($scope.currentProductImages.length == 1){
                $scope.photoInterval.end();
            }
            else{
                $scope.photoInterval.start();
            }

            $scope.currentImage = $scope.convertToActualSize($scope.util.currentProduct.primaryImage);
        });

        $scope.currentProductImages = $scope.util.currentProduct.images;

        $scope.currentImage = $scope.convertToActualSize($scope.currentProductImages[0]);

        $scope.isCurrentImage = function (image) {
            return image == $scope.currentImage;
        }

        $scope.photoInterval = {
            initialize: function(){
                $scope.sequence = [0, 1 ,2];
            },
            start : function() {
                $scope.selectThumbnail = function (image) {
                    $scope.currentImage = $scope.convertToActualSize(image);
//                i = $scope.currentProductImages.indexOf($scope.currentImage);
                }

                var a, b, c;

                $scope.selectUp = function () {
                    var p = (i - 1) == -1 ? ($scope.currentProductImages.length - 1) : (i - 1);
                    a = p;
                    b = (p + 1) == $scope.currentProductImages.length ? Math.abs($scope.currentProductImages.length % (p + 1)) : (p + 1);
                    c = (p + 2) >= $scope.currentProductImages.length ? Math.abs((p + 2) % $scope.currentProductImages.length) : (p + 2);

                    $scope.sequence = [a, b, c];
                }

                $scope.selectDown = function () {
                    var n = (i + 1) == $scope.currentProductImages.length ? 0 : i;
                    a = (n + 2) >= $scope.currentProductImages.length ? Math.abs((n + 2) % $scope.currentProductImages.length) : (n + 2);
                    b = (n + 1) == $scope.currentProductImages.length ? Math.abs($scope.currentProductImages.length % (n + 1)) : (n + 1);
                    c = n;

                    $scope.sequence = [a, b, c];
                }
                $scope.getImagesInInterval = function () {
                    a = i;
                    b = (i + 1) == $scope.currentProductImages.length ? Math.abs($scope.currentProductImages.length % (i + 1)) : (i + 1);
                    c = (i + 2) >= $scope.currentProductImages.length ? Math.abs((i + 2) % $scope.currentProductImages.length) : (i + 2);

                    $scope.sequence = [a, b, c];
                }

                var i = 0;
                $scope.photoInterval.interval = $interval(function () {
                    i++;
                    if (i == $scope.currentProductImages.length) {
                        i = 0;
                    }
                    $scope.currentImage = $scope.convertToActualSize($scope.currentProductImages[i]);

                    $scope.getImagesInInterval();
                }, 4000);

                $scope.getImagesInInterval();
            },

            end : function(){
                $interval.cancel($scope.photoInterval.interval);
                $scope.photoInterval.initialize();
            }
        }



        $scope.photoInterval.initialize();
//        $scope.startPhotoInterval();
    }).directive("modalGallery", function($compile) {
        console.log("Entered modal directive");
        return function (scope, element, attrs) {
            element.on('click', function () {

                scope.$apply(function(){
                    var src = attrs['src'];
                    var content = '<div>' +
                        '<img src="' + src + '" class="img-responsive"/>' +
                        '<img ng-src="{{currentProductImages[$index]}}" height="60px" width="70px"' +
                        'ng-repeat="item in currentProductImages | limitTo: 8"/> ' +
                        '</div>';
                    var listElem = angular.element(content);
                    var compileFn = $compile(listElem);
                    compileFn(scope);

                    console.log("List Element: " +listElem)

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
    });
