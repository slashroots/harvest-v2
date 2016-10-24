/**
 * Created by matjames007 on 9/10/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var cropAcl = require('../../../acl/crop.acl.js');
var Fakeblock = require('fakeblock');

/**
 * Retrieves all farmers.  TODO: Pagination necessary
 * @param req
 * @param res
 * @param next
 */
exports.getAllCrops = function(req, res, next) {
    //TODO: implement this endpoint

    // a fakeblock instance created for each user and each ACL
    var fakeblock = new Fakeblock({
        acl: cropAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    var connection1 = new sql.Connection(Common.getResourceDBConfig(), function(err) {
        if(err) {
            return next(err);
        }

        // Query
        var request = new sql.Request(connection1); // or: var request = connection1.request();
        request.query('select * from Reg_CROP', function(err, recordset) {
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


exports.getCropByID = function(req, res, next) {
    //TODO: implement this endpoint
    res.send([]);
};
