angular.module("sportsStore")
    .constant("dataUrl", "http://localhost:5501/products")
    .constant("orderUrl", "http://localhost:5501/orders")
    .controller("sportsStoreCtrl", function ($scope, $http, $location, dataUrl, orderUrl, cart) {
        $scope.data = {
        };
        $scope.currentProduct = {};

        $http.get(dataUrl)
            .success(function (data) {
                $scope.data.products = data;
            })
            .error(function (error) {
                $scope.data.error = error;
            });
        $scope.sendOrder = function (shippingDetails) {
            var order = angular.copy(shippingDetails);
            order.products = cart.getProducts();
            $http.post(orderUrl, order)
                .success(function (data) {
                    $scope.data.orderId = data.id;
                    cart.getProducts().length = 0;
                })
                .error(function (error) {
                    $scope.data.orderError = error;
                }).finally(function () {
                    $location.path("/complete");
                });
        }

        $scope.redirectPage = function(path, item){
            $scope.currentProduct = item;
            $location.path(path);
        }

        $scope.readyItemGallery = function(){
            $(document).ready(function () {

                $('li img').on('click', function () {
                    var src = $(this).attr('src');
                    var img = '<div style="position: relative; margin-left: 32%"><img src="' + src + '" class="img-responsive"/></div>';
                    $('#myModal').modal();
                    $('#myModal').on('shown.bs.modal', function () {
                        $('#myModal .modal-body').html(img);
                    });
                    $('#myModal').on('hidden.bs.modal', function () {
                        $('#myModal .modal-body').html('');
                    });
                });

                /*var height = 1000;
                $('.img-responsive').each(function(){
                    height = $(this).height() < height && $(this).height() > 30 ? $(this).height() : height;
                });
                $('.img-li').each(function(){
                    $(this).height(height);
                });*/
            })
        }
    });