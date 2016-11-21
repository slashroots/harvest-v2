/**
 * Created by nickajwill on 10/24/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var livestockAcl = require('../../../acl/livestock.acl.js');
var Fakeblock = require('fakeblock');
var Sequelize = require('sequelize');

/**
 * Retrieves all livestock.
 * @param req
 * @param res
 * @param next
 */

var sequelize = new Sequelize('mssql://' + process.env.MSSQL_USER + ':' + process.env.MSSQL_PASS + '@' + process.env.MSSQL_SERVER + ':1433/' + process.env.MSSQL_DB);

var Livestock = sequelize.define('std_reg_farmer_property_livestock_table', {
    IDX_Livestock: {
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'IDX_Livestock'
    },
    IDX_Property: {
        type: Sequelize.STRING,
        field: 'IDX_Property'
    },
    Livestock_Count: {
        type: Sequelize.STRING,
        field: 'Livestock_Count'
    },
    Livestock_Capacity: {
        type: Sequelize.STRING,
        field: 'Livestock_Capacity'
    },
    Livestock_Remarks: {
        type: Sequelize.STRING,
        field: 'Livestock_Remarks'
    },
    Major_Market: {
        type: Sequelize.STRING,
        field: 'Major_Market'
    },
    Minor_Market: {
        type: Sequelize.STRING,
        field: 'Minor_Market'
    },
    Major_Market_Percentage: {
        type: Sequelize.STRING,
        field: 'Major_Market_Percentage'
    },
    Minor_Market_Percentage: {
        type: Sequelize.STRING,
        field: 'Minor_Market_Percentage'
    },
    Create_Date: {
        type: Sequelize.STRING,
        field: 'Create_Date'
    },
    Update_Date: {
        type: Sequelize.STRING,
        field: 'Update_Date'
    },
    Livestock_Name: {
        type: Sequelize.STRING,
        field: 'Livestock_Name'
    },
    District: {
        type: Sequelize.STRING,
        field: 'District'
    },
    Parish_Extension_Name: {
        type: Sequelize.STRING,
        field: 'Parish_Extension_name'
    },
    Parish: {
        type: Sequelize.STRING,
        field: 'Parish'
    },
    Property_Address: {
        type: Sequelize.STRING,
        field: 'Property_Address'
    },
    Livestock_Stage: {
        type: Sequelize.STRING,
        field: 'Livestock_Stage'
    }
}, {
    timestamps: false,
    freezeTableName: true // Model tableName will be the same as the model name
});


exports.getAllLivestock = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: livestockAcl,
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

    Livestock.findAll({
        where: req.query,
        offset: parseInt(offset),
        limit: parseInt(limit)
    }).then(function(farmers) {
        for (var i = 0;i<farmers.length;i++) farmers[i] = fakeblock.applyAcl(farmers[i], 'get');
        res.send(farmers);

    });
};

exports.getLivestockByID = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: livestockAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    Livestock.findOne({ where: {IDX_Livestock: req.params.id} }).then(function(farmers) {
        res.send(fakeblock.applyAcl(farmers, 'get'));

    });
};
