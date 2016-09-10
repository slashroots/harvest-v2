/**
 * Created by matjames007 on 9/10/16.
 *
 * This file contains all the database connection information necessary
 * for the viewing of resources by the application.  The connection is
 * configured from the environment variable (MSSQL_URI) in the format:
 * mssql://username:password@localhost/database
**/

var sql = require('mssql');

sql.connect(process.env.MSSQL_URI).then(function() {

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