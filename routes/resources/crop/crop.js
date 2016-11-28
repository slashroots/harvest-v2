/**
 * Created by nickajwill on 10/24/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var cropAcl = require('../../../acl/crop.acl.js');
var Fakeblock = require('fakeblock');
var Sequelize = require('sequelize');

/**
 * Retrieves all crops.
 * @param req
 * @param res
 * @param next
 */

var sequelize = new Sequelize('mssql://' + process.env.MSSQL_USER + ':' + process.env.MSSQL_PASS + '@' + process.env.MSSQL_SERVER + ':1433/' + process.env.MSSQL_DB);

var Crop = sequelize.define('std_reg_farmer_property_crop_table', {
    IDX_Crop: {
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'IDX_Crop'
    },
    IDX_Property: {
        type: Sequelize.STRING,
        field: 'IDX_Property'
    },
    Crop_Name: {
        type: Sequelize.STRING,
        field: 'Crop_Name'
    },
    Crop_Variety: {
        type: Sequelize.STRING,
        field: 'Crop_Variety'
    },
    Crop_Total_Area: {
        type: Sequelize.STRING,
        field: 'Crop_Total_Area'
    },
    Crop_Count: {
        type: Sequelize.STRING,
        field: 'Crop_Count'
    },
    Plant_Date: {
        type: Sequelize.STRING,
        field: 'Plant_Date'
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
    Crop_Remarks: {
        type: Sequelize.STRING,
        field: 'Crop_Remarks'
    },
    Code_Area_Unit: {
        type: Sequelize.STRING,
        field: 'Code_Area_unit'
    },
    Major_Market: {
        type: Sequelize.STRING,
        field: 'Major_Market'
    },
    Minor_Market: {
        type: Sequelize.STRING,
        field: 'Minor_Market'
    },
    Property_Address: {
        type: Sequelize.STRING,
        field: 'Property_Address'
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
    Crop_Total_Area_Ha: {
        type: Sequelize.STRING,
        field: 'Crop_Total_Area_Ha'
    },
    IDX_Stakeholder: {
        type: Sequelize.STRING,
        field: 'IDX_Stakeholder'
    }
}, {
    timestamps: false,
    freezeTableName: true // Model tableName will be the same as the model name
});


exports.getAllCrops = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: cropAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    /*
     Here, we retrieve the offset and limit parameters from the query if they exist and then remove them (as well as
     the access_token in case the user opted to specify it in the url directly) so that the remaining fields can be used
     for searching.
     */
    var limit = req.query.limit || 100;
    var offset = req.query.offset || 0;
    var countvar = null;
    var start_date = null;
    var end_date = null;

    /*
    Here, we remove variables from the query that will not be used in searching the database
     */
    delete req.query.access_token;
    delete req.query.limit;
    delete req.query.offset;

    /*
     This is the default set of parameters for the findAll function below
     */
    var parameters = {
        where: req.query,
        offset: parseInt(offset),
        limit: parseInt(limit)
    };

    /*
    We will use the 'count' GET parameter to determine whether the user wants to get a count on a particular field (such as Crop Count
    in the case of a query on the /crops endpoint.
     */
    if (req.query.count !== null) {
        countvar = req.query.count;
        /*
         Here, we remove the variable from the query that will not be used in searching the database
         */
        delete req.query.count;
    }

    /*
     We will use the 'date_range' GET parameter to determine whether the user wants to filter by date on a particular field (such as Plant Date
     in the case of a query on the /crops endpoint.
     */
    if (req.query.date_range !== null) {
        date_range = req.query.date_range;
        start_date = req.query.start_date;
        end_date = req.query.end_date;
        /*
         Here, we remove variables from the query that will not be used in searching the database
         */
        delete req.query.date_range;
        delete req.query.start_date;
        delete req.query.end_date;
    }

    /*
    If we will be returning a count on a particular field we need to modify the attributes of the parameters passed to
    'findAll' so that it will count the field specified by the user in the 'count' parameter of the query
     */
    if (countvar != null) {
        parameters.attributes = [[sequelize.fn('SUM', sequelize.col(countvar)), countvar]];
        parameters.order = "'" + countvar + "' DESC";
    }
    /*
        If a 'date_range' parameter has been specified, this will be the field/column that is compare with the
        start_date and end_date (one or both of which must also be specified)
         */
    if (date_range != null) {
        var date_query = {};
        /*
        Here, we add the start and end dates to the query via the Sequelize library if they exist.
         */
        if (start_date != null) date_query.$gte = new Date(start_date);
        if (end_date != null) date_query.$lte = new Date(end_date);
        /*
        And here we add that date query object to the main 'parameters' object that we will pass to the findAll function
         */
        parameters.where[date_range] = date_query;
    }

    Crop.findAll(parameters).then(function(crops) {
        for (var i = 0;i<crops.length;i++) crops[i] = fakeblock.applyAcl(crops[i], 'get');
        res.send(crops);

    });
};

exports.getCropByID = function(req, res, next) {
    var fakeblock = new Fakeblock({
        acl: cropAcl,
        userRole: req.user.ap_app_role.ro_role_name
    });

    Crop.findOne({ where: {IDX_Crop: req.params.id} }).then(function(crops) {
        res.send(fakeblock.applyAcl(crops, 'get'));

    });
};
