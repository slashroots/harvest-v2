/**
 * Created by matjames007 on 9/10/16.
 */

var express = require('express'),
    User = require('./user'),
    App = require('../app/app-manager'),
    passport = require('passport'),
    router = express.Router();

/**
 * End Points relevant to Application Management
 */
router.get('/user/:id', User.getUser);
router.get('/users', User.getAllUsers);
router.post('/user', User.createUser);
router.get('/currentuser', User.getCurrentUser);

router.get('/user/:id/apps', App.getAppsByUserID);

router.post('/role', User.createRole);
router.get('/roles', User.getRoles);

router.get('/activate/:token', User.activateUser);

router.post('/login',
    passport.authenticate('local'),
    User.authenticate);

module.exports = router;
