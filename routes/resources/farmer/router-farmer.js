/**
 * Created by matjames007 on 9/10/16.
 */

var express = require('express');
var Farmer = require('./farmer');
var router = express.Router();

/**
 * End Points relevant to Farmers
 */
router.get('/farmers', Farmer.getAllFarmers);
router.get('/farmer/:id', Farmer.getFarmerByID);

module.exports = router;
