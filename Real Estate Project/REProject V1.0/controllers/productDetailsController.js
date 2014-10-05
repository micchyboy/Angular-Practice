angular.module("sportsStore")
    .controller("productDetailsCtrl", function($scope, $interval){

        $scope.currentProductImages = ["/images/test_image2_200x150.jpg",
            "/images/test_image3_200x150.jpg",
            "/images/test_image4_200x150.jpg",
            "/images/test_image5_200x150.jpg"];

        $scope.currentImage = $scope.currentProductImages[0];

        $scope.isCurrentImage = function(image){
            return image == $scope.currentImage;
        }



        $scope.startPhotoInterval = function(){
            $scope.selectThumbnail = function(image){
                $scope.currentImage = image;
//                i = $scope.currentProductImages.indexOf($scope.currentImage);
            }

            $scope.getImagesInInterval = function(){
                $scope.selectUp = function(){

                }

                $scope.selectDown = function(){

                }

                var a = i;
                var b = (i + 1) == $scope.currentProductImages.length ? Math.abs($scope.currentProductImages.length % (i + 1)) : (i + 1);
                var c = (i + 2) >= $scope.currentProductImages.length ? Math.abs((i + 2) % $scope.currentProductImages.length) : (i + 2);

                return [a, b, c];
            }

            var i = 0;
            $interval(function(){
                i++;
                if(i == $scope.currentProductImages.length){
                    i = 0;
                }
                $scope.currentImage = $scope.currentProductImages[i];


            }, 4000);


        }



        $scope.startPhotoInterval();
})
