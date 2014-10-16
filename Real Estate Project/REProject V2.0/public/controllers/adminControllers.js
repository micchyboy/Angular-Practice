angular.module("sportsStoreAdmin")
    .constant("authUrl", "http://localhost:5501/login")
    .constant("signUpUrl", "http://localhost:5501/signup")
    .constant("createUrl", "http://localhost:5501/create")
    .constant("uploadUrl", "http://localhost:5501/upload")
    .constant("ordersUrl", "http://localhost:5501/orders")
    .constant("primaryImageUrl", "http://localhost:5501/primary_image")
    .config(function ($locationProvider) {
        /*if (window.history && history.pushState) {
         $locationProvider.html5Mode(true);
         }*/
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function () {
            return {
                request: function (config) {
                    console.log(config.data);
//                    config.data.username = "jethrooo";
                    return config;
                }
            }
        });
    })
    .controller("topCtrl", function ($scope, authService, $location) {
        $scope.data = {};
        $scope.data.user = {};

        $scope.$on("$routeChangeSuccess", function () {
            console.log("Route change success!");
            var isAuthenticated = authService.getData("isAuthenticated");
            console.log("Is authenticated? " + (isAuthenticated))
            if (!isAuthenticated) {
                console.log("Redirect to login page..")
                $location.path("/login");
            }
            else {
                console.log("Authenticated! Proceed to main page..");
                $scope.data.user = authService.getData("user");
                $location.path("/main");
            }
        });
    })
    .controller("authCtrl", function ($scope, $http, $location, authUrl, signUpUrl, authService) {
        $scope.authenticate = function (user, pass) {
            authService.authenticateUser($scope, user, pass)
                .then(function (data) {
                    console.log("Z POWER OF PROMISES!! THE FUCKING DATA: " + data);
                    $location.path("/main");
                    $scope.data.user = data;
                },
                function (error) {
                    $scope.authenticationError = error;
                });
        }

        $scope.signUp = function () {
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
    }).controller("editorCtrl", function ($scope, createUrl, $http, $upload, uploadUrl, $timeout) {
        $scope.saveProduct = function () {
            $http({
                url: createUrl,
                method: "POST",
                data: {
                    user: $scope.data.user,
                    category: $scope.currentProduct.category,
                    description: $scope.currentProduct.description,
                    floorArea: $scope.currentProduct.floorArea,
//                    image: $scope.currentProduct.images,
                    lotArea: $scope.currentProduct.lotArea,
                    name: $scope.currentProduct.name,
                    price: $scope.currentProduct.price,
                    city: $scope.currentProduct.city,
                    bath: $scope.currentProduct.bath,
                    beds: $scope.currentProduct.beds
                }
            }).then(function (result) {
//                console.log("Successfully saved product!! " + data);
                console.log("Prooooooduct ID: " + result.data.productId);

                $scope.myModel= {
                    username: $scope.data.user.username,
                    productId: result.data.productId
                };
                if($scope.selectedFiles.length != 0){
                    for(var i = 0; i < $scope.selectedFiles.length; i++){
                        $scope.start(i);
                    }
                }
            }).catch(function (error) {
                console.log("Error is: " + error);
                $scope.authenticationError = error;
            });
        }

        $scope.onFileSelect = function ($files) {
            console.log($files);
            $scope.selectedFiles = [];
            $scope.progress = [];
            if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                    if ($scope.upload[i] != null) {
                        $scope.upload[i].abort();
                    }
                }
            }
            $scope.upload = [];
            $scope.uploadResult = [];
            $scope.selectedFiles = $files;
            $scope.dataUrls = [];
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    var loadFile = function (fileReader, index) {
                        fileReader.onload = function (e) {
                            $timeout(function () {
                                $scope.dataUrls[index] = e.target.result;
                            });
                        }
                    }(fileReader, i);
                }
                $scope.progress[i] = -1;
                /*if ($scope.uploadRightAway) {
                    $scope.start(i);
                }*/
            }
        };

        $scope.start = function (index) {
            $scope.progress[index] = 0;
            $scope.errorMsg = null;
            //$upload.upload()
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: "POST",
//                headers: {'my-header': 'my-header-value'},
                data: {
                    myModel: $scope.myModel,
                    errorCode: $scope.generateErrorOnServer && $scope.serverErrorCode,
                    errorMessage: $scope.generateErrorOnServer && $scope.serverErrorMsg
                },
                /* formDataAppender: function(fd, key, val) {
                 if (angular.isArray(val)) {
                 angular.forEach(val, function(v) {
                 fd.append(key, v);
                 });
                 } else {
                 fd.append(key, val);
                 }
                 }, */
                /* transformRequest: [function(val, h) {
                 console.log(val, h('my-header')); return val + '-modified';
                 }], */
                file: $scope.selectedFiles[index],
                fileFormDataName: 'myFile'
            });
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {
//				xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
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