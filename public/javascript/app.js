/**
 * Created by matjames007 on 9/10/16.
 */

angular.module('harvestv2', ["ngRoute", "harvestv2.services"]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: '../partials/home.html', controller: 'UserCtrl'});
    $routeProvider.when('/signin', {templateUrl: '../partials/signin.html', controller: 'UserLoginCtrl'});
    $routeProvider.when('/signup', {templateUrl: '../partials/signup.html', controller: 'UserCtrl'});
    $routeProvider.when('/confirmation', {templateUrl: '../partials/confirmation.html', controller: 'UserCtrl'});
    $routeProvider.when('/dashboard', {templateUrl: '../partials/dashboard.html', controller: 'UserDashboardCtrl'});
    $routeProvider.when('/profile', {templateUrl: '../partials/profile.html', controller: 'UserCtrl'});
    $routeProvider.when('/activate/:token', {templateUrl: '../partials/signin.html', controller: 'UserLoginCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
}]).config(['$httpProvider',function($httpProvider) {
    $httpProvider.interceptors.push('HTTPInterceptor');
}]);
