/**
 * Created by Nick on 11/10/16.
 */

var model = require('../models/db');

var Log = model.Log;
/**
 * Generates random value based on the Node.js crypto library
 * @returns a 64bit random hex string
 */
exports.accessLogger = function(actor_id, resource_url, log_level) {
    console.log("Actor : " + actor_id);
    var log = new Log({
        lo_log_actor: actor_id,
        lo_log_resource: resource_url,
        lo_log_level : log_level
    });
    log.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log(log);
        }
    });
};
