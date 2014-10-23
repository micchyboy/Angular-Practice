angular.module("sportsStore")
    .constant("productListActiveClass", "btn-primary")
    .constant("productListPageCount", 8)
    .config(function ($anchorScrollProvider) {
        $anchorScrollProvider.disableAutoScrolling();
    })
    .controller("productListCtrl", function ($scope, $filter, productListActiveClass, productListPageCount,
                                             cart, $http, deleteUrl, $route, $location) {
        var selectedCategory = null;
        var minimumPrice = 0;
        var maximumPrice = 0;

        $scope.searchData = {};
        $scope.searchData.criteria = $scope.util.sortBy.default;

        $scope.selectedPage = 1;
        $scope.pageSize = productListPageCount;
        $scope.selectCategory = function (newCategory) {
            selectedCategory = newCategory;
            $scope.selectedPage = 1;
        }
        $scope.selectPage = function (newPage) {
            $scope.selectedPage = newPage;
        }
        $scope.categoryFilterFn = function (product) {
            if (selectedCategory == null && minimumPrice == 0 && maximumPrice == 0) {
                return true;
            }
            var isLocated = selectedCategory ? (product.city == selectedCategory) : true;
            var isGreaterMinPrice = minimumPrice ? (product.price >= minimumPrice) : true
            var isLesserMaxPrice = maximumPrice ? (product.price <= maximumPrice) : true;

            return (isLocated && isGreaterMinPrice && isLesserMaxPrice);
        }
        $scope.getCategoryClass = function (category) {
            return selectedCategory == category ? productListActiveClass : "";
        }
        $scope.getPageClass = function (page) {
            return $scope.selectedPage == page ? productListActiveClass : "";
        }
        $scope.addProductToCart = function (product) {
            cart.addProduct(product.id, product.name, product.price);
        }

        $scope.searchProduct = function (location, minPrice, maxPrice) {
            selectedCategory = location ? location : null;
            minimumPrice = minPrice ? minPrice : 0;
            maximumPrice = maxPrice ? maxPrice : 0;

            $scope.selectedPage = 1;
        }

        $scope.showDetailsView = function (item) {
            $scope.util.currentProduct = item;

//            $scope.gotoElement('main');
        }

        $scope.editProduct = function (item) {
            $scope.util.mode = 'update';
            $scope.redirectPage("/editor");
            var cleanUpEditProdBroad = $scope.$on("$routeChangeSuccess", function () {
                $scope.$broadcast("editProduct", item);

                cleanUpEditProdBroad();
            })

        }

        $scope.createProduct = function () {
            $scope.util.mode = 'create';
            $scope.redirectPage('/create');
            var cleanUpCreateProdBroad = $scope.$on("$routeChangeSuccess", function () {
                $scope.$broadcast("createProduct");

                cleanUpCreateProdBroad();
            })
        }

        $scope.deleteProduct = function (item, index) {
            $http({
                url: deleteUrl,
                method: "POST",
                data: {
                    user: $scope.data.user,
                    _id: item._id
                }
            }).then(function (result) {
                console.log("Product deleted.");
                $scope.data.products.splice(index, 1);

                if($scope.util.currentProduct._id == item._id){
                    $scope.util.currentProduct = {};
                }
//                $route.reload();
            })
        }

    });