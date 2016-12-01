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


/**
 * SENDGRID is used to send emails on the platform.
 * We might require a proper configuration to a mail client within
 * RADA.  For ease of use... will continue to use this.
 * TODO: investigate the use of a RADA email server.
 */
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

/**
 * Use this path to send emails on the platform.
 * @param to_email
 * @param subject
 * @param email_body
 * @param callback
 */
exports.sendEmail = function(to_email, subject, email_body, callback){
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email(process.env.REPLY_TO);
    var to_email = new helper.Email(to_email);
    var content = new helper.Content('text/plain', email_body);
    var mail = new helper.Mail(from_email, subject, to_email, content);

    //var sg = require('sendgrid')();
    var request = sendgrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sendgrid.API(request, callback);
};

exports.APP_ACTIVE = "active", exports.APP_DISABLED="disabled";

exports.SUM_FUNCTION = "sum", exports.AVG_FUNCTION = "avg", exports.MAX_FUNCTION = "max", exports.MIN_FUNCTION = "min", exports.VAR_FUNCTION = "var", exports.STDEV_FUNCTION = "stdev";