/**
 * Created by nickjwill on 15/09/16.
 */

var services = angular.module('harvestv2.services', ['ngResource']);

//creates a user

/**
 * Factory used in creating and accessing User details
 */
services.factory('UserFactory', function($resource) {
    return $resource('/user/:id', {}, {
        create: { method: 'POST'},
        show: {method: 'GET',params: {id: '@id'}}
    });
});

services.factory('UsersFactory', function($resource) {
   return $resource('/users', {}, {
       query: { method: 'GET', isArray: true},
   });
});

/**
 * Factory used to get the Platform defaults
 */
services.factory('PlatformFactory', function($resource) {
    return $resource('/platform', {}, {
        show: {method: 'GET'}
    });
});


/**
 * View all User Roles
 */
services.factory('RolesFactory', function($resource) {
    return $resource('/roles', {}, {
        query: { method: 'GET', isArray: true}
    });
});


/**
 * Login Endpoint
 */
services.factory('AuthenticationFactory', function($resource) {
    return $resource('/login', {}, {
        login: { method: 'POST'}
    });
});


/**
 * Get all applications
 */
services.factory('AppsFactory', function($resource) {
    return $resource('/apps', {}, {
        query: { method: 'GET', isArray: true}
    });
});

/**
 * Get all applications for a specific user
 */
services.factory('UserAppsFactory', function($resource) {
    return $resource('/user/:id/apps', {}, {
        query: { method: 'GET', isArray: true}
    });
});

/**
 * Create an application
 */
services.factory('AppFactory', function($resource) {
    return $resource('/app', {}, {
        create: { method: 'POST'}
    });
});

/**
 * Activates a user account via the token
 */
services.factory('UserActivationFactory', function($resource) {
    return $resource('/activate/:token', {}, {
        activate: {method: 'GET',params: {token: '@token'}}
    });
});

/*
 * Gets current logged in user
 */
services.factory('CurrentUserFactory', function($resource) {
    return $resource('/user', {}, {
        query: { method: 'GET'}
    });
});

/*
<<<<<<< HEAD
 * Get all user activities
 */
services.factory('UserLogsFactory', function($resource) {
    return $resource('/logs', {}, {
        query: { method: 'GET', isArray: true, params: {lo_log_level: 'user_activity'}}
    });
});

/*
 * Get all application activities
 */
services.factory('ApplicationLogsFactory', function($resource) {
    return $resource('/logs', {}, {
        query: {method: 'GET', isArray: true, params: {lo_log_level: 'app_activity'}}
    });
});

/**
 * Kills the user's session.
 */
services.factory('UserLogoutFactory', function($resource) {
    return $resource('/logout', {}, {
        logout: { method: 'GET'}
    });
});
