/**
 * Created by matjames007 on 9/10/16.
 */

var express = require('express');
var Property = require('./property');
var router = express.Router();

/**
 * End Points relevant to Farmers
 */
router.get('/properties', Property.getAllProperties);
router.get('/property/:id', Property.getPropertyByID);

module.exports = router;
