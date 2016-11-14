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
    $routeProvider.when('/admin', {templateUrl: '../partials/admin-dashboard.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/admin/apps', {templateUrl: '../partials/admin-dashboard-apps.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/admin/users', {templateUrl: '../partials/admin-dashboard-user-accounts.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/admin/userlogs', {templateUrl: '../partials/admin-dashboard-user-activities.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/admin/applogs', {templateUrl: '../partials/admin-dashboard-app-activities.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/admin/roles', {templateUrl: '../partials/admin-dashboard-roles.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
}]).config(['$httpProvider',function($httpProvider) {
    $httpProvider.interceptors.push('HTTPInterceptor');
}]);
