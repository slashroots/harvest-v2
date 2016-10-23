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
exports.searchAccessLogs = function(req, res, next) {
    Log.find(req.query)
        .exec(function(err, logs) {
            if(err) {
                next(err);
            } else {
                res.send(logs);
            }
    });
};
