/**
 * Created by matjames007 on 9/10/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var farmersAcl = require('../../../acl/farmers.acl.js');
var Fakeblock = require('fakeblock');
var logging = require('../../../util/logging-util');

/**
 * Retrieves all farmers.  TODO: Pagination necessary
 * @param req
 * @param res
 * @param next
 */
exports.getAllFarmers = function(req, res, next) {
    //TODO: implement this endpoint

    var rowCounter = 0;

    // a fakeblock instance created for each user and each ACL
    var fakeblock = new Fakeblock({
        acl: farmersAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    var connection1 = new sql.Connection(Common.getResourceDBConfig(), function(err) {
        if(err) {
            return next(err);
        }

        // Query
        var request = new sql.Request(connection1); // or: var request = connection1.request();
        request.query('select top 5 * from Reg_STAKEHOLDER, Reg_FARMER_PROFILE where Reg_FARMER_PROFILE.IDX_StakeHolder = Reg_STAKEHOLDER.IDX_StakeHolder', function(err, recordset) {
            // ... error checks
            if(err) {
                return next(err);
            } else {
                for (i = 0; i < recordset.length; i++) {
                    recordset[i] = fakeblock.applyAcl(recordset[i], 'get');
                    rowCounter++;
                }
                req.log_id = logging.accessLogger(req.user,req.url,logging.LOG_LEVEL_APP_ACTIVITY,rowCounter + " farmer records were returned for this request.",true);
                res.send(recordset);
            }
        });

    });

    connection1.on('error', function(err) {
        if(err) {
            return next(err);
        }
    });

};


exports.getFarmerByID = function(req, res, next) {
    //TODO: implement this endpoint
    res.send([]);
};
