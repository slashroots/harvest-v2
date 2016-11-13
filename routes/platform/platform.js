/**
 * Created by matjames007 on 9/17/16.
 */
var Role = require('../../models/db').Role;
var setup = require('../../setup');

/**
 * This function sends all default application parameters.
 * TODO: send all default application parameters, currently only sends default role
 * @param req
 * @param res
 * @param next
 */
exports.getInfo = function(req, res, next) {
    Role.findOne(setup.DEFAULT_APP_ROLE, function(err, result) {
        if(err) {
            next(err);
        } else {
            res.send({
                default_user_role: setup.DEFAULT_USER_ROLE,
                default_app_role: result
            });
        }
    })
};