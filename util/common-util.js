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