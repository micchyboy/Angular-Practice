angular.module("sportsStoreAdmin")
    .constant("authUrl", "http://localhost:5501/login")
    .constant("signUpUrl", "http://localhost:5501/signup")
    .constant("createUrl", "http://localhost:5501/create")
    .constant("ordersUrl", "http://localhost:5501/orders")
    .config(function ($locationProvider) {
        /*if (window.history && history.pushState) {
            $locationProvider.html5Mode(true);
        }*/
    })
    .controller("topCtrl", function ($scope, authService, $location) {
        $scope.data = {};
        $scope.data.user = {};

        $scope.$on("$routeChangeSuccess", function () {
            console.log("Route change success!");
            var isAuthenticated = authService.getData("isAuthenticated");
            console.log("Is authenticated? " + (isAuthenticated))
            if(!isAuthenticated){
                console.log("Redirect to login page..")
                $location.path("/login");
            }
            else{
                console.log("Authenticated! Proceed to main page..");
                $scope.data.user = authService.getData("user");
                $location.path("/main");
            }
        });
    })
    .controller("authCtrl", function ($scope, $http, $location, authUrl,
                                      signUpUrl, authService) {
        $scope.authenticate = function (user, pass) {
//            console.log("Username: " + user + " Password: " + pass);
            /*$http({
                url: authUrl,
                method: "POST",
                data: { username: user, password: pass }
            }).success(function (data) {
                for(var i in data.user){
                    console.log(i + ": " + data.user[i])
                }
                console.log( data.isAuthenticated + " " + data.user.name);
                $scope.data.user = data.user;
                $location.path("/main");
            }).error(function (error) {
                $scope.authenticationError = error;
            });*/
            authService.authenticateUser($scope, user, pass)
            .then(function(data){
                    console.log("Z POWER OF PROMISES!! THE FUCKING DATA: " + data);
                    $location.path("/main");
                    $scope.data.user =  data;
                },
                function(error){
                    $scope.authenticationError = error;
                });
        }

        $scope.signUp = function(){
            $scope.accountCreated = false;
            console.log("Signing up!")
            $http({
                url: signUpUrl,
                method: "POST",
                data: {
                    username: $scope.credentials[0],
                    password: $scope.credentials[1],
                    email: $scope.credentials[2],
                    phone: $scope.credentials[3]
                }
            }).success(function (data) {
//                console.log("Success" + data);
                $scope.accountCreated = true;
//                $scope.authenticate(data.username, data.password)
            }).error(function (error) {
                console.log("Error is: " + error);
                $scope.authenticationError = error;
            });
        }
    })
    .controller("mainCtrl", function ($scope) {
        console.log("Main Scope FUCKING data: " + $scope.data.user);
        $scope.screens = ["Products", "Orders"];
        $scope.current = $scope.screens[0];
        $scope.setScreen = function (index) {
            $scope.current = $scope.screens[index];
        };
        $scope.getScreen = function () {
            return $scope.current == "Products"
                ? "/views/adminProducts.html" : "/views/adminOrders.html";
        };
    }).controller("editorCtrl", function ($scope, createUrl, $http) {
        $scope.saveProduct = function(){
            $http({
                url: createUrl,
                method: "POST",
                data: {
                    user: $scope.data.user,
                    category: $scope.currentProduct.category,
                    description: $scope.currentProduct.description,
                    floorArea: $scope.currentProduct.floorArea,
                    image: $scope.currentProduct.images,
                    lotArea: $scope.currentProduct.lotArea,
                    name: $scope.currentProduct.name,
                    price: $scope.currentProduct.price,
                    city: $scope.currentProduct.city,
                    bath: $scope.currentProduct.bath,
                    beds: $scope.currentProduct.beds
                }
            }).success(function (data) {
                console.log("Successfully saved product!! " + data);
                $scope.accountCreated = true;
//                $scope.authenticate(data.username, data.password)
            }).error(function (error) {
                console.log("Error is: " + error);
                $scope.authenticationError = error;
            });
        }
        console.log("Editor Scope!");

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