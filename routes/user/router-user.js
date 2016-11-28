/**
 * Created by matjames007 on 9/10/16.
 */

var express = require('express'),
    User = require('./user'),
    Common = require('../common/auth-rules')
    App = require('../app/app-manager'),
    passport = require('passport'),
    router = express.Router();

/**
 * End Points relevant to Application Management
 */
router.get('/user/:id', Common.isAuthenticated, User.getUser);
router.put('/user/:id', Common.isAuthenticated, User.updateUser);
router.get('/users', Common.isAdmin, User.getAllUsers);
router.post('/user', User.createUser);
router.get('/user', User.getCurrentUser);

router.get('/user/:id/apps', Common.isAuthenticated, App.getAppsByUserID);

router.post('/role', Common.isAdmin, User.createRole);
router.get('/roles',Common.isAdmin, User.getRoles);

router.get('/activate/:token', User.activateUser);

router.post('/login',
    passport.authenticate('local'),
    User.authenticate);

router.get('/logout', function(req, res) {
    req.logout();
    res.send({info: "Complete!"});
});

module.exports = router;
