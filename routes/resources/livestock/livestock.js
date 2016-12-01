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
    var aggregate_function = null;
    var field = null;
    var start_date = null;
    var end_date = null;

    /*
     Here, we remove variables from the query that will not be used in searching the database
     */
    delete req.query.access_token;
    delete req.query.limit;
    delete req.query.offset;

    /*
     We will use the 'aggregate_function' GET parameter to determine which of the supported aggregate_functions the user wants to carry out
     These are defined in common-util.js in case we need to add new ones later and so we can ensure validity
     */
    if (req.query.aggregate_function) {
        /*
         If an aggregate_function has been specified, we check here to see if it is one of those that we support and - if so -
         we assign it to our aggregate_function variable for use in the query.
         */
        switch (req.query.aggregate_function) {
            case Common.SUM_FUNCTION :
            case Common.AVG_FUNCTION :
            case Common.MAX_FUNCTION :
            case Common.MIN_FUNCTION :
            case Common.VAR_FUNCTION :
            case Common.STDEV_FUNCTION :
                aggregate_function = req.query.aggregate_function;
                break;
            /*
             If it isn't, we throw an appropriate error.
             */
            default :
                var err = new Error('Invalid function code specified! Please refer to the documentation!');
                err.status = 400;
                next(err);
        }
        /*
         We check if a target field has been specified and throw an appropriate error if one hasn't been specified
         */
        if (req.query.field) field = req.query.field;
        else {
            var err = new Error('You must also specify a target field when using an aggregate function! Please refer to the documentation!');
            err.status = 400;
            next(err);
        }
        /*
         Here, we remove the variable from the query that will not be used in searching the database
         */
        delete req.query.aggregate_function;
        delete req.query.field;
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
     This is the default set of parameters for the findAll function below
     */
    var parameters = {
        where: req.query,
        offset: parseInt(offset),
        limit: parseInt(limit)
    };

    if (isNaN(parameters.offset) || isNaN(parameters.limit)) {
        var err = new Error('Invalid limit or offset parameter specified. Please ensure they are numeric!');
        err.status = 400;
        next(err);
    }

    /*
     If we will be carrying out an aggregate_function on a particular field we need to modify the attributes of the parameters passed to
     'findAll' so that it will carry out the aggregate_function on the field specified
     */
    if (aggregate_function != null) {
        parameters.attributes = [[sequelize.fn(aggregate_function, sequelize.col(field)), aggregate_function]];
        parameters.order = "'" + aggregate_function + "' DESC";
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
         ONLY IF either a start or end date or both has been specified
         */
        if (start_date != null || end_date != null) parameters.where[date_range] = date_query;
        else res.send("You need to specify a start or end date (or both) to query based on a date range!");
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
