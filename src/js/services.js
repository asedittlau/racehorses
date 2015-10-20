(function() {
    var app = angular.module('myServices', [ ]);

    /** GLOBAL SERVICE */
    app.factory('GenericService', ['$http', function($http) {
        var generic = {};

        generic.getMenuItems = function() {
            return [
                { title: 'My View', state: 'myview' }
            ];
        }


        return generic;
    }]);


})();