/**
 * Created by nickjwill on 9/10/16.
 */

var model = require('../../models/db'),
    Common = require('../../util/common-util');
var Log = model.Log;

/**
 * Get all logs
 * @param req
 * @param res
 * @param next
 */
exports.getLogs = function(req, res, next) {
    Log.find()
        .populate('lo_log_app')
        .exec(function(err, logs) {
            if(err) {
                next(err);
            } else {
                res.send(logs);
            }
    });
};
