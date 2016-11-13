var express = require('express');
var App = require('./app-manager');
var router = express.Router();

/**
 * End Points relevant to Application Management
 */
router.get('/apps', App.getApplications);
router.post('/app', App.createApplication);
router.get('/app/:id', App.getAppByID);
router.put('/app/:id', App.modifyApp);

module.exports = router;
