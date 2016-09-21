/**
 * Created by matjames007 on 9/10/16.
 */

var express = require('express');
var User = require('./user');
var App = require('../app/app-manager');
var router = express.Router();

/**
 * End Points relevant to Application Management
 */
router.get('/user/:id', User.getUser);
router.get('/users', User.getAllUsers);
router.post('/user', User.createUser);
router.get('/user/:id/apps', App.getAppsByUserID);

router.post('/role', User.createRole);
router.get('/roles', User.getRoles);

router.get('/activate/:token', User.activateUser);



module.exports = router;
