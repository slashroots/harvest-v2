/**
 * Created by nickajwill on 10/24/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var propertiesAcl = require('../../../acl/properties.acl.js');
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

var Property = sequelize.define('std_reg_farmer_property_table', {
    IDX_Property: {
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'IDX_Property'
    },
    District: {
        type: Sequelize.STRING,
        field: 'District'
    },
    Parish: {
        type: Sequelize.STRING,
        field: 'Parish'
    },
    Parish_Extension_Name: {
        type: Sequelize.STRING,
        field: 'Parish_Extension_Name'
    },
    Property_Address: {
        type: Sequelize.STRING,
        field: 'Property_Address'
    },
    Property_Size: {
        type: Sequelize.STRING,
        field: 'Property_Size'
    },
    Property_Usage: {
        type: Sequelize.STRING,
        field: 'Property_Usage'
    },
    Create_Date: {
        type: Sequelize.STRING,
        field: 'Create_Date'
    },
    Update_Date: {
        type: Sequelize.STRING,
        field: 'Update_Date'
    },
    Property_Remarks: {
        type: Sequelize.STRING,
        field: 'Property_Remarks'
    },
    Volume_Num: {
        type: Sequelize.STRING,
        field: 'Volume_Num'
    },
    Folio_Num: {
        type: Sequelize.STRING,
        field: 'Folio_Num'
    },
    Distance_From_Road: {
        type: Sequelize.STRING,
        field: 'Distance_From_Road'
    },
    Primary_Property_YN: {
        type: Sequelize.STRING,
        field: 'Primary_Property_YN'
    },
    Latitude: {
        type: Sequelize.STRING,
        field: 'Latitude'
    },
    Longitude: {
        type: Sequelize.STRING,
        field: 'Longitude'
    },
    Description: {
        type: Sequelize.STRING,
        field: 'Description'
    },
    Property_Status: {
        type: Sequelize.STRING,
        field: 'Property_Status'
    },
    Ownership: {
        type: Sequelize.STRING,
        field: 'Ownership'
    },
    Distance_Units: {
        type: Sequelize.STRING,
        field: 'Distance_Units'
    },
    Property_Usage_Units: {
        type: Sequelize.STRING,
        field: 'Property_Usage_Units'
    },
    Property_Size_Units: {
        type: Sequelize.STRING,
        field: 'Property_Size_Units'
    },
    Property_Size_Ha: {
        type: Sequelize.STRING,
        field: 'Property_Size_Ha'
    },
    Irrigation_Source: {
        type: Sequelize.STRING,
        field: 'Irrigation_Source'
    },
    irrigation_access_yn: {
        type: Sequelize.STRING,
        field: 'irrigation_access_yn'
    }
}, {
    timestamps: false,
    freezeTableName: true // Model tableName will be the same as the model name
});

exports.getAllProperties = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: propertiesAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    var parameters = Common.getParameters(req.query, sequelize, next);

    var rowCounter = 0;//this will count the rows returned for logging purposes

    Property.findAll(parameters).then(function(properties) {
        for (var i = 0;i<properties.length;i++) {
            properties[i] = fakeblock.applyAcl(properties[i], 'get');
            rowCounter++;
        }
        req.log_id = logging.accessLogger(req.user,req.url,logging.LOG_LEVEL_APP_ACTIVITY,rowCounter + " property records were returned for this request.",true);
        res.send(properties);
    });
};

exports.getPropertyByID = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: propertiesAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    Property.findOne({ where: {IDX_Property: req.params.id} }).then(function(properties) {
        res.send(fakeblock.applyAcl(properties, 'get'));

    });
};
