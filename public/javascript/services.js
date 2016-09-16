/**
 * Created by nickjwill on 15/09/16.
 */

var services = angular.module('harvestv2.services', ['ngResource']);

//creates a user

services.factory('UserFactory', function($resource) {
    return $resource('/user', {}, {
        create: { method: 'POST'}
    });
});
