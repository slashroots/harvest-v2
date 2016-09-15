/**
 * Created by matjames007 on 9/10/16.
 */

angular.module('harvestv2', ["ngRoute"]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: '../partials/home.html', controller: 'HomepageCtrl'});
    $routeProvider.when('/signin', {templateUrl: '../partials/signin.html', controller: 'HomepageCtrl'});
    $routeProvider.when('/signup', {templateUrl: '../partials/signup.html', controller: 'HomepageCtrl'});
    $routeProvider.when('/confirmation', {templateUrl: '../partials/confirmation.html', controller: 'HomepageCtrl'});
    $routeProvider.when('/dashboard', {templateUrl: '../partials/dashboard.html', controller: 'HomepageCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
}]);
