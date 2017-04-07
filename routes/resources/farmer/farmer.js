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
        type: Sequelize.STRING,
        field: 'IDX_Farmer_Profile'
    },
    IDX_Stakeholder: {
        primaryKey: true,
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

var FarmerPersonal = sequelize.define('std_reg_farmer_personal_table', {
    IDX_Stakeholder: {
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'IDX_Stakeholder'
    },
    Stakeholder_Num: {
        type: Sequelize.STRING,
        field: 'Stakeholder_Num'
    },
    Stakeholder_Type_Code: {
        type: Sequelize.STRING,
        field: 'Stakeholder_Type_Code'
    },
    Company_Name: {
        type: Sequelize.STRING,
        field: 'Company_Name'
    },
    First_Name: {
        type: Sequelize.STRING,
        field: 'First_Name'
    },
    Middle_Name: {
        type: Sequelize.STRING,
        field: 'Middle_Name'
    },
    Last_Name: {
        type: Sequelize.STRING,
        field: 'Last_Name'
    },
    Alias: {
        type: Sequelize.STRING,
        field: 'Alias'
    },
    DOB: {
        type: Sequelize.STRING,
        field: 'DOB'
    },
    Gender: {
        type: Sequelize.STRING,
        field: 'Gender'
    },
    Jas_Receipt: {
        type: Sequelize.STRING,
        field: 'JAS_Receipt'
    },
    Res_Street_Address: {
        type: Sequelize.STRING,
        field: 'Res_Street_Address'
    },
    Res_District_Name: {
        type: Sequelize.STRING,
        field: 'Res_District_Name'
    },
    Res_Post_Office: {
        type: Sequelize.STRING,
        field: 'Res_Post_Office'
    },
    Res_Tele_Num: {
        type: Sequelize.STRING,
        field: 'Res_Tele_Num'
    },
    Bus_Street_Address: {
        type: Sequelize.STRING,
        field: 'Bus_Street_Address'
    },
    Bus_District_Name: {
        type: Sequelize.STRING,
        field: 'Bus_District_Name'
    },
    Bus_Post_Office: {
        type: Sequelize.STRING,
        field: 'Bus_Post_Office'
    },
    Bus_Tele_Num: {
        type: Sequelize.STRING,
        field: 'Bus_Tele_Num'
    },
    Cell_Num: {
        type: Sequelize.STRING,
        field: 'Cell_Num'
    },
    Fax_Num: {
        type: Sequelize.STRING,
        field: 'Fax_Num'
    },
    Email_Address: {
        type: Sequelize.STRING,
        field: 'Email_Address'
    },
    Identification_Num: {
        type: Sequelize.STRING,
        field: 'Identification_Num'
    },
    Photo_Path: {
        type: Sequelize.STRING,
        field: 'Photo_Path'
    },
    Interviewer: {
        type: Sequelize.STRING,
        field: 'Interviewer'
    },
    VerifiedYN: {
        type: Sequelize.STRING,
        field: 'VerifiedYN'
    },
    Stakeholder_Status: {
        type: Sequelize.STRING,
        field: 'Stakeholder_Status'
    },
    Res_Parish: {
        type: Sequelize.STRING,
        field: 'Res_Parish'
    },
    Bus_Parish: {
        type: Sequelize.STRING,
        field: 'Bus_Parish'
    },
    Stakeholder_Type: {
        type: Sequelize.STRING,
        field: 'Stakeholder_Type'
    },
    Update_Date: {
        type: Sequelize.STRING,
        field: 'Update_Date'
    },
    Create_Date: {
        type: Sequelize.STRING,
        field: 'Create_Date'
    },
    Registration_Date: {
        type: Sequelize.STRING,
        field: 'Registration_Date'
    },
    Verified_Date: {
        type: Sequelize.STRING,
        field: 'Verified_Date'
    }
}, {
    timestamps: false,
    freezeTableName: true // Model tableName will be the same as the model name
});

Farmer.hasOne(FarmerPersonal, {foreignKey : 'IDX_Stakeholder', targetKey: 'IDX_Stakeholder', as : 'Farmer_Personal_Info'});

exports.getAllFarmers = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: farmersAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    var parameters = Common.getParameters(req.query, sequelize, next);
    parameters.include = [{ model: FarmerPersonal, as:'Farmer_Personal_Info'}];
    var rowCounter = 0;//this will count the rows returned for logging purposes

    Farmer.findAll(parameters).then(function(farmers) {
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

    Farmer.findOne({ where: {IDX_Stakeholder: req.params.id}, include: { model: FarmerPersonal, as:'Farmer_Personal_Info'} }).then(function(farmers) {
        res.send(fakeblock.applyAcl(farmers, 'get'));
    });
};