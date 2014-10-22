var resolve = {
    delay: function($q, $timeout) {
        console.log("delay");
        var delay = $q.defer();
        $timeout(delay.resolve, 0, false);
        return delay.promise;
    }
};

angular.module("sportsStore", ["customFilters", "cart", "ngRoute", "ngAnimate", "angularFileUpload"])
    .config(function ($routeProvider) {
        $routeProvider.when("/products", {
            templateUrl: "/views/productList.html",
            resolve: resolve
        });
        /*$routeProvider.when("/details", {
            templateUrl: "/views/productDetails.html"
        });*/
        $routeProvider.when("/editor", {
            templateUrl: "/views/editorView.html",
            resolve: resolve
        });
        $routeProvider.otherwise({
            redirectTo: "/products"
        });
    })
    .run(function ($templateCache, $http) {
        $http.get('/views/adminLogin.html', {cache: $templateCache});
    })
    .constant("domain", "http://localhost:5501")
    .constant("dataUrl", "http://localhost:5501/jethro/products")
    .constant("authUrl", "http://localhost:5501/login")
    .constant("logOutUrl", "http://localhost:5501/logout")
    .constant("signUpUrl","http://localhost:5501/signup")
    .constant("createUrl", "http://localhost:5501/create")
    .constant("updateUrl", "http://localhost:5501/update")
    .constant("uploadUrl", "http://localhost:5501/upload")
    .constant("ordersUrl","http://localhost:5501/orders")
    .constant("primaryImageUrl", "http://localhost:5501/primary_image")
    .config(function ($locationProvider) {
        /* if (window.history && history.pushState) {
         $locationProvider.html5Mode(true);
         }*/
    })
    .controller("sportsStoreCtrl", function ($scope, $http, $location, dataUrl, cart,
                                             $anchorScroll, $timeout, anchorSmoothScroll, authService) {
        $scope.data = {
        };
        $scope.util = {};
        $scope.util.currentProduct = {};


        $scope.$on("$routeChangeSuccess", function () {
            console.log("Route change success! Main");
            var isAuthenticated = authService.getData("isAuthenticated");
            console.log("Is authenticated? " + (isAuthenticated))
            if (!isAuthenticated) {
                console.log("Redirect to login page..")
                $location.path("/products");
            }
            else{
                $scope.data.user = authService.getData("user");
            }
        });

        $scope.logout = function () {
            console.log("Logging out..")
            authService.logOut().then(function () {
                authService.removeData("user");
                authService.removeData("isAuthenticated");
            }, function (error) {
                $scope.authenticationError = error;
            });
        }

        $http.get(dataUrl)
            .success(function (data) {
                for (var i in data) {
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

        $scope.redirectPage = function (path) {
//            $scope.util.currentProduct = {};
            $location.path(path);
        }

        $scope.gotoElement = function (eID) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('details');

            // call $anchorScroll()
            anchorSmoothScroll.scrollTo(eID);

        };

        $scope.isAuthenticated = function () {
            if (authService.getData("isAuthenticated") == true) {
                return true;
            }
            return false;
        };

        $scope.isProduct = function () {
            var path = $location.path();
            if (path == "/products") {
                return true
            }
            return false;
        }



        //for sliding content
        var oldLocation = '';
        $scope.$on('$routeChangeStart', function(angularEvent, next) {
            console.log("routeChangeStart");
            var isDownwards = true;
            if (next && next.$$route) {
                var newLocation = next.$$route.originalPath;
                if (oldLocation !== newLocation && oldLocation.indexOf(newLocation) !== -1) {
                    isDownwards = false;
                }

                oldLocation = newLocation;
            }

            $scope.isDownwards = isDownwards;
        });
        //end of sliding content
    })

    .filter("daysBetween", function () {
        return function (value) {
            var date;
            if (angular.isString(value)) {
                date = new Date(value);
            }

            //Get 1 day in milliseconds
            var one_day = 1000 * 60 * 60 * 24;

            // Convert both dates to milliseconds
            var date1_ms = date.getTime();
            var date2_ms = new Date().getTime();

            // Calculate the difference in milliseconds
            var difference_ms = date2_ms - date1_ms;

            var difference_days = Math.round(difference_ms / one_day);
            // Convert back to days and return
            var desc = "";
            if (difference_days == 0) {
                return "Added today";
            }
            else if (difference_days == 1) {
                return "Added 1 day ago"
            }
            else {
                return "Added " + difference_days + " days ago";
            }
        };
    })
    .directive("credentialsForm", function ($compile, $templateCache) {
//        alert("Entered simple repeater directive..");
        return {
            restrict: "EA",
            link: function (scope, elem, attrs) {
                elem.on("click", function (e) {

                    if (e.target.innerText == "Log In") {
                        scope.isLogin = true;
                    }
                    else {
                        scope.isLogin = false;
                    }

                    var content = $templateCache.get("/views/adminLogin.html");
                    var listElem = angular.element(content[1]);
                    var compileFn = $compile(listElem);
                    compileFn(scope);

                    $('#myModal').modal();
                    $('#myModal').on('shown.bs.modal', function () {
                        $('#myModal .modal-body').html(listElem);
                    });
                    $('#myModal').on('hidden.bs.modal', function () {
                        $('#myModal .modal-body').html('');
                    });
                    scope.$on("authSuccess", function(){
                        $('#myModal').modal('hide');
                    });

                });


            }
        }
    })
    .directive("ngScopeElement", function () {
        var directiveDefinitionObject = {

            restrict: "A",

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {
                        scope[iAttrs.ngScopeElement] = iElement;
                    }
                };
            }
        };

        return directiveDefinitionObject;
    });