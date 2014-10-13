angular.module("sportsStoreAdmin")
    .constant("authUrl", "http://localhost:5501/login")
    .constant("ordersUrl", "http://localhost:5501/orders")
    .config(function ($locationProvider) {
        /*if (window.history && history.pushState) {
            $locationProvider.html5Mode(true);
        }*/
    })
    .controller("topCtrl", function ($scope) {
        $scope.data = {};
    })
    .controller("authCtrl", function ($scope, $http, $location, authUrl) {
        $scope.authenticate = function (user, pass) {
            console.log("Username: " + user + " Password: " + pass);
            $http({
                url: authUrl,
                method: "POST",
                data: { username: user, password: pass }
            }).success(function (data) {
                console.log( data.isAuthenticated + " " + data.user.name);
                $scope.data.user = data.user;
                $location.path("/main");
            }).error(function (error) {
                $scope.authenticationError = error;
            });
        }
    })
    .controller("mainCtrl", function ($scope) {
        $scope.screens = ["Products", "Orders"];
        $scope.current = $scope.screens[0];
        $scope.setScreen = function (index) {
            $scope.current = $scope.screens[index];
        };
        $scope.getScreen = function () {
            return $scope.current == "Products"
                ? "/views/adminProducts.html" : "/views/adminOrders.html";
        };
    })
    .controller("ordersCtrl", function ($scope, $http, ordersUrl) {
        $http.get(ordersUrl, {withCredentials: true})
            .success(function (data) {
                $scope.orders = data;
            })
            .error(function (error) {
                $scope.error = error;
            });
        $scope.selectedOrder;
        $scope.selectOrder = function (order) {
            $scope.selectedOrder = order;
        };
        $scope.calcTotal = function (order) {
            var total = 0;
            for (var i = 0; i < order.products.length; i++) {
                total +=
                    order.products[i].count * order.products[i].price;
            }
            return total;
        }
    });
;