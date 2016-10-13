var express = require('express');
var Log = require('./log');
var router = express.Router();

/**
 * Endpoints related to logging
 */
router.get('/logs/application', Log.getApplicationAccessLogs);

module.exports = router;
