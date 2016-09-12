/**
 * Created by matjames007 on 9/10/16.
 *
 * This file contains all the database connection information necessary
 * for the viewing of resources by the application.  The connection is
 * configured from the environment variables (see common-util.js)
**/

var sql = require('mssql');

var MSSQL_URI = "mssql://" + process.env.MSSQL_USER + ":"+ process.env.MSSQL_PASS +"@"
    +process.env.MSSQL_SERVER + "/" + process.env.MSSQL_DB;

sql.connect(MSSQL_URI).then(function() {

    console.log("Resources DB connection established!")

    /**
     * A sample connection to print out all db tables
     */
    new sql.Request().query("SELECT TABLE_NAME FROM " +
        "Harvest_API.INFORMATION_SCHEMA.Tables WHERE TABLE_TYPE = 'BASE TABLE'")
        .then(function(recordset) {
            console.log("Tables in DB: ");
            for(var i in recordset) {
                console.log(i + ": " + recordset[i]['TABLE_NAME']);
            }
        }).catch(function(err) {
            console.log(err);
        });

}).catch(function(err) {
    console.log(err);
});