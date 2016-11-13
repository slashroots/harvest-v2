var express = require('express');
var Log = require('./log');
var router = express.Router();
var Common = require('../common/auth-rules');

/**
 * Endpoints related to logging
 */
router.get('/logs', Common.isAdmin, Log.searchAccessLogs);

module.exports = router;
