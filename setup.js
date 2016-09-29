/**
 * Created by matjames007 on 9/17/16.
 */

var models = require('./models/db');

// Create Default Role
var DEFAULT_ROLE = {
    ro_role_name: "aggregate_user",
    ro_role_desc: "Has access to no personal information"
};

var APP_NAME = "Harvest v2";

/**
 * First setup the default role if it doesn't exist
 */
exports.setupApplication = function() {
    models.Role.findOneAndUpdate(DEFAULT_ROLE, DEFAULT_ROLE, {upsert: true},
    function(err, res) {
        if(err) {
            console.error(err);
        } else {
            console.info(res);
        }
    });
};

exports.DEFAULT_ROLE = DEFAULT_ROLE;