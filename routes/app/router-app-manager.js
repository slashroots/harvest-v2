var express = require('express');
var App = require('./app-manager');
var router = express.Router();
var Common = require('../common/auth-rules')

/**
 * End Points relevant to Application Management
 */
router.get('/apps', Common.isAuthenticated, App.getApplications);
router.post('/app', Common.isAuthenticated, App.createApplication);
router.get('/app/:id', Common.isAuthenticated, App.getAppByID);

module.exports = router;
