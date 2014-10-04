angular.module("sportsStore")
    .constant("productListActiveClass", "btn-primary")
    .constant("productListPageCount", 8)
    .controller("productListCtrl", function ($scope, $filter, productListActiveClass, productListPageCount, cart) {
        var selectedCategory = null;
        var minimumPrice = 0;
        var maximumPrice = 0;

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
            if(selectedCategory == null && minimumPrice == 0 && maximumPrice == 0){
                return true;
            }
            var isLocated = selectedCategory ? (product.category == selectedCategory) : true;
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

        $scope.searchProduct = function(location, minPrice, maxPrice){
            selectedCategory = location ? location : null;
            minimumPrice = minPrice ? minPrice : 0;
            maximumPrice = maxPrice ? maxPrice : 0;

            $scope.selectedPage = 1;
        }
    });