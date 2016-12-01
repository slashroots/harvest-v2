/**
 * Created by matjames007 on 9/10/16.
 */

/**
 * Note the structure of the angular application.  Each route can potentially have its own
 * template, stylesheet and controller.
 */
angular.module('harvestv2', ["ngRoute", "harvestv2.services", "angular-table", "angularCSS"])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        /*$routeProvider.when('/', {
            templateUrl: '../partials/home.html',
            controller: 'UserCtrl',
            css: '/stylesheets/style.css'});*/
        $routeProvider.when('/', {redirectTo: '/docs'});
        $routeProvider.when('/docs', {
            templateUrl: '../partials/docs.html',
            controller: 'DocsCtrl',
            css:'/stylesheets/redoc/main.css'});
        $routeProvider.when('/signin', {
            templateUrl: '../partials/signin.html',
            controller: 'UserLoginCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.when('/signup', {
            templateUrl: '../partials/signup.html',
            controller: 'UserCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.when('/confirmation', {
            templateUrl: '../partials/confirmation.html',
            controller: 'UserCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.when('/dashboard', {
            templateUrl: '../partials/dashboard.html',
            controller: 'UserDashboardCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.when('/profile', {
            templateUrl: '../partials/profile.html',
            controller: 'UserCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.when('/activate/:token', {
            templateUrl: '../partials/signin.html',
            controller: 'UserLoginCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.when('/admin', {
            templateUrl: '../partials/admin/dashboard.html',
            controller: 'AdminDashboardCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.when('/admin/:entity', {
            templateUrl: '../partials/admin/dashboard-entity.html',
            controller: 'AdminDashboardCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.when('/admin/:entity/logs', {
            templateUrl: '../partials/admin/dashboard-entity-logs.html',
            controller: 'AdminActivityCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.when('/admin/:entity/roles', {
            templateUrl: '../partials/admin/dashboard-roles.html',
            controller: 'AdminRoleCtrl',
            css: '/stylesheets/style.css'});
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .config(['$httpProvider',function($httpProvider) {
        $httpProvider.interceptors.push('HTTPInterceptor');
    }]);
