/**
 * Created by matjames007 on 9/10/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var propertiesAcl = require('../../../acl/properties.acl.js');
var Fakeblock = require('fakeblock');

/**
 * Retrieves all farmers.  TODO: Pagination necessary
 * @param req
 * @param res
 * @param next
 */
exports.getAllProperties = function(req, res, next) {
    // a fakeblock instance created for each user and each ACL
    var fakeblock = new Fakeblock({
        acl: propertiesAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    var connection1 = new sql.Connection(Common.getResourceDBConfig(), function(err) {
        if(err) {
            return next(err);
        }

        // Query
        var request = new sql.Request(connection1); // or: var request = connection1.request();
        request.query('select top 100 * from std_reg_farmer_property_table', function(err, recordset) {
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


exports.getPropertyByID = function(req, res, next) {
    // a fakeblock instance created for each user and each ACL
    var fakeblock = new Fakeblock({
        acl: propertiesAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    var connection1 = new sql.Connection(Common.getResourceDBConfig(), function(err) {
        if(err) {
            return next(err);
        }

        // Query
        var request = new sql.Request(connection1); // or: var request = connection1.request();
        request.query('select * from std_reg_farmer_property_table WHERE IDX_Property=' + req.params.id, function(err, recordset) {
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
