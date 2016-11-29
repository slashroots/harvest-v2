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

    Farmer.findOne({ where: {IDX_Stakeholder: req.params.id} }).then(function(farmers) {
        res.send(fakeblock.applyAcl(farmers, 'get'));

    });
};
