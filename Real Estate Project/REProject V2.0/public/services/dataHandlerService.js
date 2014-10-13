angular.module("sportsStore")
    .factory("dataHandler",function(items){
       var savedItems = items;
        return {
            getItems : function(){
                return savedItems;
            }
        }
    });
