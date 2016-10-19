/**
 * Created by Nick on 11/10/16.
 */

var model = require('../models/db');

var Log = model.Log;

exports.accessLogger = function(user_id, resource_url, log_level, description, result_flag, entity, end_result) {//did the request succeed or fail?
    var log = new Log({
        lo_log_user: user_id,
        lo_log_requested: resource_url,
        lo_log_level : log_level,
        lo_log_success : result_flag,
        lo_log_description : description,//whether the request succeeded or failed, the description will tell us what happened
        lo_log_entity: entity,//entity before any changes made to it
        lo_log_end_result: end_result
});
    log.save(function(err, result) {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
            }
    });
};