angular.module("sportsStoreAdmin")
    .factory("sessionStorage", function () {
        return {

            get: function (key) {
                return localStorage.getItem(key);
            },

            save: function (key, data) {
                localStorage.setItem(key, JSON.stringify(data));
            },

            remove: function (key) {
                localStorage.removeItem(key);
            },

            clearAll: function () {
                localStorage.clear();
            }
        };
    }).factory('authService', function ($http, sessionStorage, authUrl, $location, $q) {
        //TODO: Try using $cookie or $cookieStore services

        return {

            getData: function (key) {
                console.log("Using authentication service..");
                return JSON.parse(sessionStorage.get(key));
            },

            setData: function (key, data) {
                sessionStorage.save(key, data);
            },

            removeData: function (key) {
                sessionStorage.remove(key);
            },

            authenticateUser: function ($scope, username, password) {
                var deferred = $q.defer();
                var isAuthenticated = sessionStorage.get("isAuthenticated");
                console.log("Previously authenticated? " + (isAuthenticated));
                if (!isAuthenticated) {
                    $http({
                        url: authUrl,
                        method: "POST",
                        data: { username: username, password: password }
                    }).success(function (data) {
                        sessionStorage.save("user", data.user);
                        sessionStorage.save("isAuthenticated", data.isAuthenticated);

                        deferred.resolve(data.user);
                    }).error(function (error) {
                        deferred.reject(error);
                    });
                }
                else {

                    var user = sessionStorage.get("user");
                    console.log(user)
                    deferred.resolve(JSON.parse(user));
                }

                return deferred.promise;
            }
        };
    });
