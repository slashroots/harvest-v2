/**
 * Created by matjames007 on 9/10/16.
 */
var Crypto = require('crypto');
var DB_CONFIG = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASS,
    server: process.env.MSSQL_SERVER,
    database: process.env.MSSQL_DB
};

/**
 * Generates random value based on the Node.js crypto library
 * @returns a 64bit random hex string
 */
exports.getRandomToken = function() {
    return Crypto.randomBytes(64).toString('hex');
};

/**
 * Needed for establishing connections to the DB for resources
 * @returns {{user: *, password: *, server: *, database: *}}
 */
exports.getResourceDBConfig = function() {
    return DB_CONFIG;
};

var nodemailer = require('nodemailer');

exports.sendEmail = function(to_email, subject, email_body, callback){
    /*
    We build the object containing email options that will be passed to the sendMail function - the field names are
    pretty self explanatory
     */
    var mailOptions = {
        from: process.env.REPLY_TO, // sender address
        to: to_email, // list of receivers
        subject: subject, // Subject line
        html: email_body // html body - we could have used 'content' instead of 'html' if it was plaintext.
    };
    /*
    Here we create a transporter object that connects us to RADA's email server.
     */
    var transporter = nodemailer.createTransport('smtp://' + process.env.SMTP_USER + ':' + process.env.SMTP_PASSWORD + '@' + process.env.SMTP_SERVER + ':' + process.env.SMTP_PORT);
    /*
    We send the email here and then return control to user.js via the callback function and handle any errors there.
     */
    transporter.sendMail(mailOptions, callback);
};

exports.APP_ACTIVE = "active", exports.APP_DISABLED="disabled";

exports.SUM_FUNCTION = "sum", exports.AVG_FUNCTION = "avg", exports.MAX_FUNCTION = "max", exports.MIN_FUNCTION = "min", exports.VAR_FUNCTION = "var", exports.STDEV_FUNCTION = "stdev";

exports.getParameters = function (q, sequelize, next) {
    /*
     Here, we retrieve the offset and limit parameters from the query if they exist and then remove them (as well as
     the access_token in case the user opted to specify it in the url directly) so that the remaining fields can be used
     for searching.
     */
    var limit = q.limit || 100;
    var offset = q.offset || 0;
    var operation = null;
    var field = null;
    var start_date = null;
    var end_date = null;

    /*
     Here, we remove variables from the query that will not be used in searching the database
     */
    delete q.access_token;
    delete q.limit;
    delete q.offset;

    /*
     We will use the 'operation' GET parameter to determine which of the supported operations the user wants to carry out
     These are defined in common-util.js in case we need to add new ones later and so we can ensure validity
     */
    if (q.operation) {
        /*
         If an operation has been specified, we check here to see if it is one of those that we support and - if so -
         we assign it to our operation variable for use in the query.
         */
        switch (q.operation) {
            case this.SUM_FUNCTION :
            case this.AVG_FUNCTION :
            case this.MAX_FUNCTION :
            case this.MIN_FUNCTION :
            case this.VAR_FUNCTION :
            case this.STDEV_FUNCTION :
                operation = q.operation;
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
        if (q.field) field = q.field;
        else {
            var err = new Error('You must also specify a target field when using an aggregate function! Please refer to the documentation!');
            err.status = 400;
            next(err);
        }
        /*
         Here, we remove the variable from the query that will not be used in searching the database
         */
        delete q.operation;
        delete q.field;
    }

    /*
     We will use the 'date_range' GET parameter to determine whether the user wants to filter by date on a particular field (such as Plant Date
     in the case of a query on the /crops endpoint.
     */
    if (q.date_range !== null) {
        date_range = q.date_range;
        start_date = q.start_date;
        end_date = q.end_date;
        /*
         Here, we remove variables from the query that will not be used in searching the database
         */
        delete q.date_range;
        delete q.start_date;
        delete q.end_date;
    }

    /*
     This is the default set of parameters for the findAll function below
     */
    var parameters = {
        where: q,
        offset: parseInt(offset),
        limit: parseInt(limit)
    };

    if (isNaN(parameters.offset) || isNaN(parameters.limit)) {
        var err = new Error('Invalid limit or offset parameter specified. Please ensure they are numeric!');
        err.status = 400;
        next(err);
    }

    /*
     If we will be carrying out an operation on a particular field we need to modify the attributes of the parameters passed to
     'findAll' so that it will carry out the operation on the field specified
     */
    if (operation != null) {
        parameters.attributes = [[sequelize.fn(operation, sequelize.col(field)), operation]];
        parameters.order = "'" + operation + "' DESC";
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

    return parameters;
}