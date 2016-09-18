/**
 * Created by matjames007 on 9/17/16.
 */

var express = require('express');
var router = express.Router();
var Platform = require('./platform');

/**
 * End Points relevant to Platform settings
 */

router.get('/platform', Platform.getInfo);

module.exports = router;
