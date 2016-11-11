/**
 * Created by matjames007 on 9/10/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var farmersAcl = require('../../../acl/farmers.acl.js');
var Fakeblock = require('fakeblock');
var Sequelize = require('sequelize');

/**
 * Retrieves all farmers.  TODO: Pagination necessary
 * @param req
 * @param res
 * @param next
 */
exports.getAllFarmers = function(req, res, next) {

    var fakeblock = new Fakeblock({
        acl: farmersAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    var sequelize = new Sequelize('mssql://' + process.env.MSSQL_USER + ':' + process.env.MSSQL_PASS + '@' + process.env.MSSQL_SERVER + ':1433/' + process.env.MSSQL_DB);

    var Farmer = sequelize.define('std_reg_farmer_profile_table', {
        IDX_Farmer_Profile: {
            primaryKey: true,
            type: Sequelize.STRING,
            field: 'IDX_Farmer_Profile' // Will result in an attribute that is firstName when user facing but first_name in the database
        },
        IDX_Stakeholder: {
            type: Sequelize.STRING,
            field: 'IDX_Stakeholder'
        },
        Education_Level: {
            type: Sequelize.STRING,
            field: 'Education_Level'
        },
        Farmer_Type: {
            type: Sequelize.STRING,
            field: 'Farmer_Type'
        },
        Main_Agri_Activity: {
            type: Sequelize.STRING,
            field: 'Main_Agri_Activity'
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    });

    Farmer.find().then(function(err, farmers) {
        if(err) {
            next(err);
        } else {
            res.send(farmers);
            //res.send(fakeblock.applyAcl(farmers, 'get'));
        }
    });

};

exports.getFarmerByID = function(req, res, next) {

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
        request.query('select * from std_reg_farmer_profile_table where std_reg_farmer_profile_table.IDX_StakeHolder = ' + req.params.id, function(err, recordset) {
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
