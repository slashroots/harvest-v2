/**
 * Created by matjames007 on 9/10/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var farmersAcl = require('../../../acl/farmers.acl.js');
var Fakeblock = require('fakeblock');

/**
 * Retrieves all farmers.  TODO: Pagination necessary
 * @param req
 * @param res
 * @param next
 */
exports.getAllFarmers = function(req, res, next) {
    //TODO: implement this endpoint

    // a fakeblock instance created for each user and each ACL
    var fakeblock = new Fakeblock({
        acl: farmersAcl,
        userRole: req.app_role_name
    });

    var connection1 = new sql.Connection(Common.getResourceDBConfig(), function(err) {
        if(err) {
            return next(err);
        }

        // Query
        var request = new sql.Request(connection1); // or: var request = connection1.request();
        request.query('select * from Reg_STAKEHOLDER, Reg_FARMER_PROFILE where Reg_FARMER_PROFILE.IDX_StakeHolder = Reg_STAKEHOLDER.IDX_StakeHolder', function(err, recordset) {
            // ... error checks
            if(err) {
                return next(err);
            } else {

                for (i = 0; i < recordset.length; i++) {
                    recordset[i] = fakeblock.applyAcl(recordset[i], 'get');
                }
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
