angular.module("sportStore")
    .factory("dataHandler",function(items){
       var savedItems = items;
        return {
            getItems : function(){
                return savedItems;
            }
        }
    });
