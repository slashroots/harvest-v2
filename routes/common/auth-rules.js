/**
 * Created by matjames007 on 11/13/16.
 */
var express = require('express');
var router = express.Router();

/**
 * Check if the user is Authenticated
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        var error = new Error("Authentication Necessary - Protected Resource");
        error.status = 400;
        return next(error);
    }
};

/**
 * Check if the user is an authenticated administrator
 * @param req
 * @param res
 * @param next
 */
exports.isAdmin = function(req, res, next) {
    if(req.isAuthenticated()) {
        if (req.user.us_user_role == 'admin') {
            return next();
        } else {
            var error = new Error("Authorization Necessary - Protected Resource");
            error.status = 401;
            return next(error);
        }
    }
};