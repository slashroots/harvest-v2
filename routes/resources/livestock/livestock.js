/**
 * Created by nickajwill on 10/24/16.
 */
var Common = require('../../../util/common-util');
var sql = require('mssql');
var livestockAcl = require('../../../acl/livestock.acl.js');
var Fakeblock = require('fakeblock');
var Sequelize = require('sequelize');
var logging = require('../../../util/logging-util');
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
    var sum = null;
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

    if (isNaN(parameters.offset) || isNaN(parameters.limit)) res.send("Invalid limit or offset parameter specified. Please ensure they are numeric!");

    /*
     We will use the 'count' GET parameter to determine whether the user wants to get a count on a particular field (such as Crop Count
     in the case of a query on the /crops endpoint.
     */
    if (req.query.sum !== null) {
        sum = req.query.sum;
        /*
         Here, we remove the variable from the query that will not be used in searching the database
         */
        delete req.query.sum;
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
    if (sum != null) {
        parameters.attributes = [[sequelize.fn('SUM', sequelize.col(sum)), sum]];
        parameters.order = "'" + sum + "' DESC";
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

    var rowCounter = 0;//this will count the rows returned for logging purposes

    Livestock.findAll(parameters).then(function(livestock) {
        for (var i = 0;i<livestock.length;i++) {
            livestock[i] = fakeblock.applyAcl(livestock[i], 'get');
            rowCounter++;
        }
        req.log_id = logging.accessLogger(req.user,req.url,logging.LOG_LEVEL_APP_ACTIVITY,rowCounter + " livestock records were returned for this request.",true);
        res.send(livestock);

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
