/**
 * Created by matjames007 on 9/10/16.
 */

angular.module('harvestv2', ["ngRoute", "harvestv2.services", "angular-table"]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: '../partials/home.html', controller: 'UserCtrl'});
    $routeProvider.when('/signin', {templateUrl: '../partials/signin.html', controller: 'UserLoginCtrl'});
    $routeProvider.when('/signup', {templateUrl: '../partials/signup.html', controller: 'UserCtrl'});
    $routeProvider.when('/confirmation', {templateUrl: '../partials/confirmation.html', controller: 'UserCtrl'});
    $routeProvider.when('/dashboard', {templateUrl: '../partials/dashboard.html', controller: 'UserDashboardCtrl'});
    $routeProvider.when('/activate/:token', {templateUrl: '../partials/signin.html', controller: 'UserLoginCtrl'});
    $routeProvider.when('/admin', {templateUrl: '../partials/admin-dashboard.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/admin/apps', {templateUrl: '../partials/admin-dashboard-apps.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});

    //$locationProvider.html5Mode(true);
}]);
