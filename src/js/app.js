(function() {
    var app = angular.module('myApp', [
        'ui.router',
        'ngTouch',
        'myServices',
        'myControllers',
        'myDirectives',
        'myFilters'
    ]);

    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
        .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: '/templates/partials/header.html',
                    controller: 'HeaderCtrl'
                },
                'content': {
                    templateUrl: '/templates/partials/content.html'
                },
                'footer': {
                    templateUrl: '/templates/partials/footer.html'
                }
            }
        })
        .state('app.myview', {
            url: 'myview',
            views: {
                'content@': {
                    templateUrl: 'templates/myview.html'
                }
            }
        })

    });
})();
