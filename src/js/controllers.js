(function() {
    var app = angular.module('myControllers', [ 'myServices' ]);

    /** GLOBAL APP CONTROLLER */
    app.controller('GlobalCtrl', ['$scope',
        function ($scope) {

        }]);

    /** HEADER CONTROLLER */
    app.controller('HeaderCtrl', ['$scope', 'GenericService',
        function ($scope, GenericService) {

            $scope.items = GenericService.getMenuItems();

        }]);

})();
