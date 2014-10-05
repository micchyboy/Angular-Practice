angular.module("sportsStore")
    .controller("productDetailsCtrl", function ($scope, $interval) {

        $scope.currentProductImages = ["/images/test_image2_200x150.jpg",
            "/images/test_image3_200x150.jpg",
            "/images/test_image4_200x150.jpg",
            "/images/test_image5_200x150.jpg"];

        $scope.currentImage = $scope.currentProductImages[0];

        $scope.isCurrentImage = function (image) {
            return image == $scope.currentImage;
        }


        $scope.startPhotoInterval = function () {
            $scope.selectThumbnail = function (image) {
                $scope.currentImage = image;
//                i = $scope.currentProductImages.indexOf($scope.currentImage);
            }

            var a;
            var b;
            var c

            $scope.sequence = [];
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
            $interval(function () {
                i++;
                if (i == $scope.currentProductImages.length) {
                    i = 0;
                }
                $scope.currentImage = $scope.currentProductImages[i];

                $scope.getImagesInInterval();
            }, 4000);

            $scope.getImagesInInterval();
        }

        $scope.startPhotoInterval();
    })
