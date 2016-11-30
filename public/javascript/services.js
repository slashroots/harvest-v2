/**
 * Created by nickjwill on 15/09/16.
 */

var services = angular.module('harvestv2.services', ['ngResource']);

/**
 *
 * Factory to be used intercept all 401 error messages
 * and direct user to login page.
 *
 **/
services.factory('HTTPInterceptor', ['$q','$location', function($q,$location){
    return {
        responseError: function(response){
            if(response.status == 401) {
                var encodedURL = encodeURIComponent($location.absUrl());
                window.location = "#/signin?goTo=" + encodedURL;
                return;
            }
            return $q.reject(response);
        }
    };
}]);

/**
 * Factory used in changing a user's password
 */
services.factory('UserPasswordFactory', function($resource) {
    return $resource('/user/:id/password', {}, {
        change: {method: 'PUT', params: {id: '@id'}}
    });
});


/**
 * Factory used in creating and accessing User details
 */
services.factory('UserFactory', function($resource) {
    return $resource('/user/:id', {}, {
        create: { method: 'POST'},
        show: {method: 'GET',params: {id: '@id'}},
        update: {method: 'PUT',params: {id: '@id'}}
    });
});

services.factory('UsersFactory', function($resource) {
   return $resource('/users', {}, {
       query: { method: 'GET', isArray: true}
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
 * Create/Modify an application
 */
services.factory('AppFactory', function($resource) {
    return $resource('/app/:id', {}, {
        create: { method: 'POST'},
        update: { method: 'PUT', params: {id: '@id'}}
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

/**
 * Gets current logged in user
 */
services.factory('CurrentUserFactory', function($resource) {
    return $resource('/user', {}, {
        query: { method: 'GET'}
    });
});


/**
 * Get all activities, specify the activity in order to differentiate the user
 * activities from application activities.  Accepts query parameters in order to
 * get this task done.
 */
services.factory('LogsFactory', function($resource) {
    return $resource('/logs', {}, {
        query: {method: 'GET', isArray: true}
    });
});

/**
 * Terminate user's session
 */
services.factory('UserLogoutFactory', function($resource) {
    return $resource('/logout', {}, {
        logout: { method: 'GET'}
    });
});
