/**
 * Created by nick22891 on 15/01/17.
 */

var express = require('express');
var Receipt = require('./receipt');
var router = express.Router();

/**
 * End Points relevant to Farmers
 */
router.get('/receipts', Receipt.getAllReceipts);
router.get('/receipt/:id', Receipt.getReceiptByID);

module.exports = router;
