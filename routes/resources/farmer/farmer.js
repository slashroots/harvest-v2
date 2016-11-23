/**
 * Created by matjames007 on 9/10/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var farmersAcl = require('../../../acl/farmers.acl.js');
var Fakeblock = require('fakeblock');
var Sequelize = require('sequelize');
var logging = require('../../../util/logging-util');

/**
 * Retrieves all farmers.
 * @param req
 * @param res
 * @param next
 */

var sequelize = new Sequelize('mssql://' + process.env.MSSQL_USER + ':' + process.env.MSSQL_PASS + '@' + process.env.MSSQL_SERVER + ':1433/' + process.env.MSSQL_DB);

var Farmer = sequelize.define('std_reg_farmer_profile_table', {
    IDX_Farmer_Profile: {
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'IDX_Farmer_Profile'
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
    },
    Holding_Start: {
        type: Sequelize.STRING,
        field: 'Holding_Start'
    },
    Nearest_Police_Station: {
        type: Sequelize.STRING,
        field: 'Nearest_Police_Station'
    },
    Jas_Farmer_Group: {
        type: Sequelize.STRING,
        field: 'Jas_Farmer_Group'
    },
    Farmer_Profile_Remarks: {
        type: Sequelize.STRING,
        field: 'Farmer_Profile_Remarks'
    },
    Create_Date: {
        type: Sequelize.STRING,
        field: 'Create_Date'
    },
    Update_Date: {
        type: Sequelize.STRING,
        field: 'Update_Date'
    },
    Respondent: {
        type: Sequelize.STRING,
        field: 'Respondent'
    },
    Manager: {
        type: Sequelize.STRING,
        field: 'Manager'
    },
    Income_Source: {
        type: Sequelize.STRING,
        field: 'Income_Source'
    },
    Occupation: {
        type: Sequelize.STRING,
        field: 'Occupation'
    },
    Training_Method: {
        type: Sequelize.STRING,
        field: 'Training_Method'
    },
    Agri_Institution: {
        type: Sequelize.STRING,
        field: 'Agri_Institution'
    },
    Qualification: {
        type: Sequelize.STRING,
        field: 'Qualification'
    },
    Agri_Training: {
        type: Sequelize.STRING,
        field: 'Agri_Training'
    },
    Live_On_Farm: {
        type: Sequelize.STRING,
        field: 'Live_On_Farm'
    }
}, {
    timestamps: false,
    freezeTableName: true // Model tableName will be the same as the model name
});


exports.getAllFarmers = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: farmersAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    /*
    Here, we retrieve the offset and limit parameters from the query if they exist and then remove them (as well as
    the access_token in case the user opted to specify it in the url directly) so that the remaining fields can be used
    for searching.
     */
    var limit = req.query.limit || 100;
    var offset = req.query.offset || 0;
    delete req.query.access_token;
    delete req.query.limit;
    delete req.query.offset;

    var rowCounter = 0;//this will count the rows returned for logging purposes

    Farmer.findAll({
        where: req.query,
        offset: parseInt(offset),
        limit: parseInt(limit)
    }).then(function(farmers) {
            for (var i = 0;i<farmers.length;i++) {
                farmers[i] = fakeblock.applyAcl(farmers[i], 'get');
                rowCounter++;
            }
            req.log_id = logging.accessLogger(req.user,req.url,logging.LOG_LEVEL_APP_ACTIVITY,rowCounter + " farmer records were returned for this request.",true);
            res.send(farmers);
    });
};

exports.getFarmerByID = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: farmersAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    Farmer.findOne({ where: {IDX_Stakeholder: req.params.id} }).then(function(farmers) {
        res.send(fakeblock.applyAcl(farmers, 'get'));

    });
};
