var express = require('express');
var App = require('./app-manager');
var router = express.Router();

/**
 * End Points relevant to Application Management
 */
router.get('/app', App.getApplications);
router.post('/app', App.createApplication);
router.get('/app/:id', App.getAppByID);

module.exports = router;
