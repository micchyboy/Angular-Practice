var resolve = {
    delay: function($q, $timeout) {
        console.log("delay");
        var delay = $q.defer();
        $timeout(delay.resolve, 0, false);
        return delay.promise;
    }
};

angular.module('viewTransitionApp', ['ngRoute', 'ngAnimate'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/viewA', {
                templateUrl: 'viewA.html',
                resolve: resolve
            })
            .when('/viewA/:viewAB', {
                templateUrl: 'viewAB.html',
                resolve: resolve
            })
            .when('/viewA/:viewAB/:viewABC', {
                templateUrl: 'viewABC.html',
                resolve: resolve
            })
            .when('/viewA/:viewAB/:viewABC/:viewABCD', {
                templateUrl: 'viewABCD.html',
                resolve: resolve
            })
            .otherwise({
                redirectTo: '/viewA'
            });
    })
    .controller('MainCtrl', function ($scope) {
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
    });