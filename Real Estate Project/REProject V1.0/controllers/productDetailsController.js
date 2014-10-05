angular.module("sportsStore")
    .controller("productDetailsCtrl", function($scope, $interval){

        $scope.currentProductImages = ["/images/test_image2_200x150.jpg",
            "/images/test_image3_200x150.jpg",
            "/images/test_image4_200x150.jpg"];

        $scope.currentImage = $scope.currentProductImages[0];

        $scope.isCurrentImage = function(image){
            return image == $scope.currentImage;
        }



        $scope.startPhotoInterval = function(){
            $scope.selectThumbnail = function(image){
                $scope.currentImage = image;
//                i = $scope.currentProductImages.indexOf($scope.currentImage);
            }

            var i = 1;
            $interval(function(){
                $scope.currentImage = $scope.currentProductImages[i];
                i++;
                if(i == 3){
                    i = 0;
                }

            }, 4000);
        }

        $scope.startPhotoInterval();
})
