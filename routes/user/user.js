/**
 * Created by matjames007 on 9/10/16.
 */

var model = require('../../models/db');
var common = require('../../util/common-util');
var User = model.User,
    Role = model.Role;
var sha1 = require('sha1');

/**
 * Only accessible by platform administrator
 * @param req
 * @param res
 * @param next
 */
exports.createRole = function(req, res, next) {
    var role = new Role(req.body);
    role.save(function(err) {
        if(err) {
            next(err);
        } else {
            res.send(role);
        }
    })
};

/**
 * Only accessible by platform administrator
 * @param req
 * @param res
 * @param next
 */
exports.getRoles = function(req, res, next) {
    Role.find().exec(function(err, docs) {
        if(err) {
            next(err);
        } else {
            res.send(docs);
        }
    })
};

/**
 * Only accessible by platform administrator.
 * @param req
 * @param res
 * @param next
 */
exports.getAllUsers = function(req, res, next) {
    User.find()
        .exec(function(err, docs) {
            if(err) {
                next(err);
            } else {
                res.send(docs);
            }
        });
};


/**
 * View specific user profile.  Only accessible by owner of the data or by platform
 * administrator.
 * @param req
 * @param res
 * @param next
 */
exports.getUser = function(req, res, next) {
    User.findById(req.params.id)
        .exec(function(err, docs) {
            if(err) {
                next(err);
            } else {
                res.send(docs);
            }
        });
};

/**
 * Can be accessed by the public, however state value cannot be set.
 * Must first default to 'pending'.
 * @param req
 * @param res
 * @param next
 */
exports.createUser = function(req, res, next) {
    var user = new User(req.body);
    user.us_activation_token = common.getRandomToken();
    //TODO: must ensure the state is set to pending
    user.save(function(err) {
        if(err) {
            next(err);
        } else {
            common.sendEmail(
                user.us_email_address,
                "Activation Link",
                "Hi " + user.us_user_first_name + ",\n" +
                "You have successfully created an Harvest account. " +
                "To complete the process, activate your account by clicking on the link below: " +
                "http://localhost:3000/activate/" + user.us_activation_token + "\n" +
                "If you have any questions about this email, contact RADA.",
                function(error, info) {
                    if(error) {
                        next(error);
                    } else {
                        //removing the token and password from the response (security)
                        user.us_activation_token = undefined;
                        user.us_password = undefined;
                        res.send(user);
                    }
                });

        }
    });
};

/**
 * Accessible by public.  Looks up the token and updates the state to
 * active for the user.
 * @param req
 * @param res
 * @param next
 */
exports.activateUser = function(req, res, next) {
    User.findOneAndUpdate(
        {us_activation_token: req.params.token},
        {$set: {us_state: 'active'}})
        .exec(function(err, docs) {
            if(err) {
                next(err);
            } else {
                //removing the token and password from the response (security)
                docs.us_activation_token = undefined;
                docs.us_password = undefined;
                res.send(docs);
            }
        });
};