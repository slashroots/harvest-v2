/**
 * Created by matjames007 on 9/10/16.
 */

angular.module('harvestv2', ["ngRoute", "harvestv2.services", "angular-table"]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: '../partials/home.html', controller: 'UserCtrl'});
    $routeProvider.when('/signin', {templateUrl: '../partials/signin.html', controller: 'UserLoginCtrl'});
    $routeProvider.when('/signup', {templateUrl: '../partials/signup.html', controller: 'UserCtrl'});
    $routeProvider.when('/confirmation', {templateUrl: '../partials/confirmation.html', controller: 'UserCtrl'});
    $routeProvider.when('/dashboard', {templateUrl: '../partials/dashboard.html', controller: 'UserDashboardCtrl'});
    $routeProvider.when('/profile', {templateUrl: '../partials/profile.html', controller: 'UserCtrl'});
    $routeProvider.when('/activate/:token', {templateUrl: '../partials/signin.html', controller: 'UserLoginCtrl'});
    $routeProvider.when('/admin', {templateUrl: '../partials/admin/dashboard.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/admin/:entity', {templateUrl: '../partials/admin/dashboard-entity.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/admin/:entity/logs', {templateUrl: '../partials/admin/dashboard-entity-logs.html', controller: 'AdminActivityCtrl'});
    $routeProvider.when('/admin/:entity/roles', {templateUrl: '../partials/admin/dashboard-roles.html', controller: 'AdminRoleCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
}]).config(['$httpProvider',function($httpProvider) {
    $httpProvider.interceptors.push('HTTPInterceptor');
}]);
