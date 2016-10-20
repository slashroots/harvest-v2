var express = require('express');
var Log = require('./log');
var router = express.Router();

/**
 * Endpoints related to logging
 */
router.post('/logs', Log.searchAccessLogs);

module.exports = router;
