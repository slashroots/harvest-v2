/**
 * Created by matjames007 on 9/10/16.
 */

var express = require('express');
var Crop = require('./crop');
var router = express.Router();

/**
 * End Points relevant to Farmers
 */
router.get('/crops', Crop.getAllCrops);
router.get('/crop/:id', Crop.getCropByID);

module.exports = router;
