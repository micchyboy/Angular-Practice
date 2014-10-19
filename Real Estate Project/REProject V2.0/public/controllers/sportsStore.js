angular.module("sportsStore")
    .constant("dataUrl", "http://localhost:5501/jethro/products")
    .constant("orderUrl", "http://localhost:5501/orders")
    .config(function ($locationProvider) {
       /* if (window.history && history.pushState) {
            $locationProvider.html5Mode(true);
        }*/
    })
    .controller("sportsStoreCtrl", function ($scope, $http, $location, dataUrl, orderUrl, cart,
                                             $location, $anchorScroll, $timeout, anchorSmoothScroll) {
        $scope.data = {
        };
        $scope.util = {};
        $scope.util.currentProduct = {};

        $http.get(dataUrl)
            .success(function (data) {
                for(var i in data){
                    console.log(i + ": " + data[i]);
                }
                console.log(data.products);
                $scope.data.products = data.products;
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
            $scope.util.currentProduct = item;
            $location.path(path);
        }

        /*$scope.invokeScrollToHash = function(elementId){
            $timeout(function(){
                $location.hash(elementId);
                $anchorScroll();
            }, 200);
        }*/

        $scope.gotoElement = function (eID){
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('details');

            // call $anchorScroll()
            anchorSmoothScroll.scrollTo(eID);

        };
        //TODO: Might use this for actual size photo gallery
        /*$scope.readyItemGallery = function(){
            $(document).ready(function () {
                $('.photos-gallery img').on('click', function () {
                    var src = $(this).attr('src');
                    var img = '<div><img src="' + src + '" class="img-responsive"/></div>';
                    $('#myModal').modal();
                    $('#myModal').on('shown.bs.modal', function () {
                        $('#myModal .modal-body').html(img);
                    });
                    $('#myModal').on('hidden.bs.modal', function () {
                        $('#myModal .modal-body').html('');
                    });
                });
            })
        }*/


    })
    .filter("daysBetween", function () {
        return function (value) {
            var date;
            if(angular.isString(value)){
                date = new Date(value);
            }

            //Get 1 day in milliseconds
            var one_day=1000*60*60*24;

            // Convert both dates to milliseconds
            var date1_ms = date.getTime();
            var date2_ms = new Date().getTime();

            // Calculate the difference in milliseconds
            var difference_ms = date2_ms - date1_ms;

            var difference_days = Math.round(difference_ms/one_day);
            // Convert back to days and return
            var desc = "";
            if(difference_days == 0){
                return "Added today";
            }
            else if(difference_days == 1){
                return "Added 1 day ago"
            }
            else {
                return "Added " + difference_days + " days ago";
            }
        };
    });