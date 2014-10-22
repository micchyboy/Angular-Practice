angular.module("sportsStore")
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
    .controller("editorCtrl", function ($scope, createUrl, $http, $upload, uploadUrl, $timeout, $q, dataHandler) {
        $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
        $scope.imageDescriptions = [];
        $scope.currentProduct = {};
        var deferred;

        dataHandler.copyContents($scope);

        $scope.$on("$locationChangeStart", function () {
            var obj = {key: "currentProduct", value: $scope.currentProduct};
            $scope.$emit("saveState", obj);
        })

        $scope.$on("editProduct", function (event, product) {
            $scope.currentProduct = product;
        })

        $scope.saveProduct = function () {
            $http({
                url: createUrl,
                method: "POST",
                data: {
                    user: $scope.data.user,
                    category: $scope.currentProduct.category,
                    description: $scope.currentProduct.description,
                    floorArea: $scope.currentProduct.floorArea,
                    lotArea: $scope.currentProduct.lotArea,
                    name: $scope.currentProduct.name,
                    price: $scope.currentProduct.price,
                    city: $scope.currentProduct.city,
                    bath: $scope.currentProduct.bath,
                    beds: $scope.currentProduct.beds,
                    features: $scope.currentProduct.features,
                    details: $scope.currentProduct.details
                }
            }).then(function (result) {
                deferred = [];
//                console.log("Successfully saved product!! " + data);
                console.log("Prooooooduct ID: " + result.data.productId);

                $scope.myModel = {
                    username: $scope.data.user.username,
                    productId: result.data.productId
                };
                if ($scope.selectedFiles.length != 0) {
                    for (var i = 0; i < $scope.selectedFiles.length; i++) {
                        deferred[i] = $q.defer();
                        if (i == 0) {
                            $scope.myModel.imageDescription = $scope.imageDescriptions[i];
                            $scope.start(i);
                        }

                        (function (i) {
//                            var j = i;
                            deferred[i].promise.then(function () {
                                i++;
                                if (i < $scope.selectedFiles.length) {
                                    $scope.myModel.imageDescription = $scope.imageDescriptions[i];
                                    $scope.start(i);
                                }
                            })
                        })(i);
//                        console.log("Image description "+ i +": " +  $scope.myModel.imageDescription)

                    }
                }
            }).catch(function (error) {
                console.log("Error is: " + error);
                $scope.authenticationError = error;
            });
        }

        $scope.onFileSelect = function ($files) {
//            console.log($files);
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
                deferred[index].resolve();
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
    })
    .directive("simpleRepeater", function ($rootScope) {
//        alert("Entered simple repeater directive..");
        return {
            restrict: "EA",
            template: "<div ng-transclude></div>",
            transclude: true,
            replace: true,
            scope: true,
            compile: function (element, attrs, transcludeFn) {
                return function ($scope, $element, $attr) {
                    $scope.$$nextSibling.index = 0; //accesses the transcluded scope
                    var parentScope = $scope.$new();
                    var index = 1;
                    var lastElem = $element;

                    var clonedElems = [];
                    var items;
                    parentScope.$on("editProduct", function (event, product) {

                        if($attr["type"] == "features"){
                            items = product.features;
                        }
                        else{
                            items = product.details;
                        }
                        for (var i = 1; i < items.length; i++) {
                            var childScope = parentScope.$new();
                            childScope.index = i;
                            (function (childScope) {
                                childScope.$on("indexChanged", function (event, removedIndex) {
                                    if (childScope.index > removedIndex) {
                                        childScope.index--;
                                        childScope.$digest();
                                    }
                                })
                            })(childScope);

                            transcludeFn(childScope, function (clone) {
                                clonedElems.push(clone);
                                var buttonElem = clone.find("button");
                                buttonElem.addClass("btn-danger").text("-");

                                (function (childScope) {
                                    buttonElem.on("click", function () {
                                        items.splice(childScope.index, 1);
                                        clonedElems.splice(childScope.index - 1, 1);
                                        lastElem = clonedElems[clonedElems.length - 1];
                                        if(!lastElem){
                                            lastElem = $element;
                                        }
                                        clone.remove();
                                        index--;
                                        var childScopeIndex = childScope.index;
                                        childScope.$destroy();
                                        parentScope.$broadcast("indexChanged", childScopeIndex);
                                    });
                                })(childScope);

                                lastElem.after(clone);
                                lastElem = clone;
                            });

                        }
                        index = items.length;
                    })


                    $element.find("button").on("click", function () {
                        parentScope.$apply(function () {
                            var childScope = parentScope.$new();
                            childScope.index = index++;

                            (function (childScope) {
                                childScope.$on("indexChanged", function (event, removedIndex) {
                                    if (childScope.index > removedIndex) {
                                        childScope.index--;
                                        childScope.$digest();
                                    }
                                })
                            })(childScope);

                            transcludeFn(childScope, function (clone) {
                                clonedElems.push(clone);
                                var buttonElem = clone.find("button");
                                buttonElem.addClass("btn-danger").text("-");

                                (function (childScope) {
                                    buttonElem.on("click", function () {
                                        items.splice(childScope.index, 1);
                                        clonedElems.splice(childScope.index - 1, 1);
                                        lastElem = clonedElems[clonedElems.length - 1];
                                        if(!lastElem){
                                            lastElem = $element;
                                        }
                                        clone.remove();
                                        index--;
                                        var childScopeIndex = childScope.index;
                                        childScope.$destroy();
                                        parentScope.$broadcast("indexChanged", childScopeIndex);
                                    });
                                })(childScope);

                                lastElem.after(clone);
                                lastElem = clone;
                            });
                        })

                    });
                }
            }
        }
    })

