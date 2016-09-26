/**
 * Created by matjames007 on 9/10/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');


/**
 * Retrieves all farmers.  TODO: Pagination necessary
 * @param req
 * @param res
 * @param next
 */
exports.getAllFarmers = function(req, res, next) {
    //TODO: implement this endpoint

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
