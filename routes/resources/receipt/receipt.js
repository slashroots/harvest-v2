/**
 * Created by nickajwill on 10/24/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var receiptAcl = require('../../../acl/crop.acl.js');
var Fakeblock = require('fakeblock');
var Sequelize = require('sequelize');
var logging = require('../../../util/logging-util');
/**
 * Retrieves all crops.
 * @param req
 * @param res
 * @param next
 */

var sequelize = new Sequelize('mssql://' + process.env.MSSQL_USER + ':' + process.env.MSSQL_PASS + '@' + process.env.MSSQL_SERVER + ':1433/' + process.env.MSSQL_DB);

var Receipt = sequelize.define('JAS_Books', {
    IDX_JAS_Books: {
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'IDX_JAS_Books'
    },
    IDX_Stakeholder: {
        type: Sequelize.STRING,
        field: 'IDX_Stakeholder'
    },
    Book_Sequence_No: {
        type: Sequelize.STRING,
        field: 'Book_Sequence_No'
    },
    Receipt_No: {
        type: Sequelize.STRING,
        field: 'Receipt_No'
    },
    Date_Purchased: {
        type: Sequelize.STRING,
        field: 'Date_Purchased'
    },
    Create_Date: {
        type: Sequelize.STRING,
        field: 'Create_Date'
    },
    Update_Date: {
        type: Sequelize.STRING,
        field: 'Update_Date'
    },
    range1: {
        type: Sequelize.INTEGER,
        field: 'range1'
    },
    range2: {
        type: Sequelize.INTEGER,
        field: 'range2'
    },
    investigationyn: {
        type: Sequelize.STRING,
        field: 'investigationyn'
    },
    remarks: {
        type: Sequelize.STRING,
        field: 'remarks'
    },
    parish_code: {
        type: Sequelize.STRING,
        field: 'parish_code'
    }
}, {
    timestamps: false,
    freezeTableName: true // Model tableName will be the same as the model name
});

exports.getAllReceipts = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: receiptAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    var parameters = Common.getParameters(req.query, sequelize, next);

    var rowCounter = 0;//this will count the rows returned for logging purposes

    Receipt.findAll(parameters).then(function(receipts) {
        for (var i = 0;i<receipts.length;i++) {
            receipts[i] = fakeblock.applyAcl(receipts[i], 'get');
            rowCounter++;
        }
        req.log_id = logging.accessLogger(req.user,req.url,logging.LOG_LEVEL_APP_ACTIVITY,rowCounter + " receipts were returned for this request.",true);
        res.send(receipts);
    });
};

exports.getReceiptByID = function(req, res, next) {//we will return the receipt book that this receipt id/number came from
    var fakeblock = new Fakeblock({
        acl: receiptAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    //we check the range for the receipt books to find the one that this receipt was taken from
    Receipt.findOne({ where: {range1: {$lte : req.params.id}, range2: {$gte : req.params.id} }}).then(function(receipts) {
        res.send(fakeblock.applyAcl(receipts, 'get'));

    });
};