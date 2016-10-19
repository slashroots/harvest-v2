/**
 * Created by matjames007 on 9/10/16.
 */

var model = require('../../models/db'),
    common = require('../../util/common-util'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TokenStrategy = require('passport-token-auth').Strategy;

var logging = require('../../util/logging-util');

var User = model.User,
    Role = model.Role,
    Log = model.Log,
    App = model.App;


/**
 * Function used to send the user details back the application
 * only after successfully authenticating.  This is intended
 * for logging into the API using the local strategy.
 * @param req
 * @param res
 * @param next
 */
exports.authenticate = function(req, res, next) {
    res.send(req.user);
};

/**
 * Setup the token Strategy for the resources endpoint.
 * This will be used during web-service calls to any RADA
 * specific resources.
 */
passport.use(new TokenStrategy({passReqToCallback:true},
    function(req, token, done) {
        App.findOne({ ap_app_token: token })
            .populate('ap_app_role')
            .exec(function (err, app) {
                if (err) {
                    logging.accessLogger(null,req.url,"app_activity", "A database error occurred while authenticating.",false);
                    return done(err);
                }
                if (!app) {
                    logging.accessLogger(null,req.url,"app_activity", "No application exists with the token supplied.",false);
                    return done(null, false);
                }
                if(app.ap_app_status != 'active') {
                    logging.accessLogger(app,req.url,"app_activity","The application whose token was submitted is not active.",false);
                    return done(null, false);
                }
                return done(null, app, { scope: 'all' });
            });
    }
));

/**
 * Setup the local strategy required for login and establish checks
 * for credentials provided during login.
 */
passport.use(new LocalStrategy({passReqToCallback:true},
    function(req, username, password, done) {
        User.findOne({ us_username: username }, 'us_username ' +
            'us_user_first_name us_user_last_name us_email_address us_contact' +
            'us_user_role us_state us_password' ,
            function (err, user) {
                console.log(err, user);
                if (err) {
                    logging.accessLogger(null,req.url,logging.LOG_LEVEL_USER_ACTIVITY, "A database error occurred while authenticating.",false);
                    return done(err);
                }
                if (!user) {
                    logging.accessLogger(null,req.url,logging.LOG_LEVEL_USER_ACTIVITY, "Incorrect user credentials supplied.",false);
                    return done(null, false, {message: 'Incorrect credentials.'});
                }
                if (user.us_password != password) {
                    logging.accessLogger(null,req.url,logging.LOG_LEVEL_USER_ACTIVITY, "Incorrect user credentials supplied.",false);
                    return done(null, false, {message: 'Incorrect credentials.'});
                }
                if (user.us_state != 'active') {
                    logging.accessLogger(user, req.url,logging.LOG_LEVEL_USER_ACTIVITY, "User account requires activation",false);
                    return done(null, false, {message: 'User Activation Required.'});
                }
                else logging.accessLogger(user, req.url,logging.LOG_LEVEL_USER_ACTIVITY, "User Login Successful",true);
                return done(null, user);
            }
        );
    }
));

/**
 * Removing confidential items from the user before transmission
 * over the wire.
 */
passport.serializeUser(function(user, done) {
    user.us_password = undefined;
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

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
 * Get the current logged in user
 * @param req
 * @param res
 * @param next
 */
exports.getCurrentUser = function(req, res, next) {
    res.send(req.user);
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
                req.protocol + '://' + req.get('host') + "/#/activate/" + user.us_activation_token + "\n" +//this gives us the full url of the server and appends the 'activate' and the token
                "If you have any questions about this email, contact RADA.",
                function(error, info) {
                    if(error) {
                        user.us_activation_token = undefined;
                        user.us_password = undefined;
                        logging.accessLogger(user,req.url,logging.LOG_LEVEL_USER_ACTIVITY, "A new user account was created but an error occurred when trying to send the activation email.",true, user);
                        next(error);
                    } else {
                        //removing the token and password from the response (security)
                        logging.accessLogger(user,req.url,logging.LOG_LEVEL_USER_ACTIVITY, "A new user account was created and the activation email was sent.",true, user);
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
                logging.accessLogger(null,req.url,logging.LOG_LEVEL_USER_ACTIVITY, "User activation failed with an invalid link.",false, err);
                next(err);
            } else {
                //removing the token and password from the response (security)
                docs.us_activation_token = undefined;
                docs.us_password = undefined;
                logging.accessLogger(docs,req.url,logging.LOG_LEVEL_USER_ACTIVITY, "The user's account was successfully activated.",true, docs);
                res.send(docs);
            }
        });
};