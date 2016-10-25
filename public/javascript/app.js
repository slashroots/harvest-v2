/**
 * Created by matjames007 on 9/10/16.
 */

angular.module('harvestv2', ["ngRoute", "harvestv2.services"]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: '../partials/home.html', controller: 'UserCtrl'});
    $routeProvider.when('/signin', {templateUrl: '../partials/signin.html', controller: 'UserLoginCtrl'});
    $routeProvider.when('/signup', {templateUrl: '../partials/signup.html', controller: 'UserCtrl'});
    $routeProvider.when('/confirmation', {templateUrl: '../partials/confirmation.html', controller: 'UserCtrl'});
    $routeProvider.when('/dashboard', {templateUrl: '../partials/dashboard.html', controller: 'UserDashboardCtrl'});
    $routeProvider.when('/dashboard-admin', {templateUrl: '../partials/dashboard-admin.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/dashboard-admin-apps', {templateUrl: '../partials/admin-apps.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/dashboard-admin-apps-activities', {templateUrl: '../partials/admin-apps-activities.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/dashboard-admin-apps-devapps', {templateUrl: '../partials/admin-apps-devapps.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/dashboard-admin-users', {templateUrl: '../partials/admin-users.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/dashboard-admin-users-accounts', {templateUrl: '../partials/admin-users-accounts.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/dashboard-admin-users-activities', {templateUrl: '../partials/admin-users-activities.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/dashboard-admin-roles', {templateUrl: '../partials/admin-roles.html', controller: 'AdminDashboardCtrl'});
    $routeProvider.when('/activate/:token', {templateUrl: '../partials/signin.html', controller: 'UserLoginCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});

    //$locationProvider.html5Mode(true);
}]);
