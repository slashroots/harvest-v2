/**
 * Created by matjames007 on 9/10/16.
 */

var express = require('express');
var Livestock = require('./livestock');
var router = express.Router();

/**
 * End Points relevant to Farmers
 */
router.get('/livestock', Livestock.getAllLivestock);
router.get('/livestock/:id', Livestock.getLivestockByID);

module.exports = router;
