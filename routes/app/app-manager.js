/**
 * Created by matjames007 on 9/10/16.
 */

var model = require('../../models/db'),
    Common = require('../../util/common-util');
var App = model.App

/**
 * Find all applications on the platform, should be accessible by only
 * platform administrators
 * @param req
 * @param res
 * @param next
 */
exports.getApplications = function(req, res, next) {
    App.find()
        .where('us_app_user', req.user._id)
        .exec(function(err, docs) {
            if(err) {
                next(err);
            } else {
                res.send(docs);
            }
    });
};

/**
 * Create application based on structure defined in the models schema.
 * Must pass the user's id for this to work.  Accessible to activated users.
 * @param req
 * @param res
 * @param next
 */
exports.createApplication = function(req, res, next) {
    var app = new App(req.body);
    app.ap_app_token = Common.getRandomToken();
    app.ap_app_status = Common.APP_ACTIVE;
    app.us_app_user = req.user._id;
    console.log(app);
    app.save(function(err) {
        if(err) {
            next(err);
        } else {
            res.send(app);
        }
    });
};

/**
 * Get details of application by the specific reference application id.
 * Should check first if the user is the owner of the application.  If not
 * we should throw an error.
 * @param req
 * @param res
 * @param next
 */
exports.getAppByID = function(req, res, next) {
    App.findById(req.params.id)
        .exec(function(err, docs) {
            if(err) {
                next(err);
            } else {
                res.send(docs);
            }
        });
};

/**
 * Modify an app
 */
exports.modifyApp = function(req, res, next) {
    if (req.query.app_status != undefined) {
        App.findById(req.params.id)
            .exec(function(err, app) {
                if(err) {
                    next(err);
                } else {
                    if (req.query.app_status == Common.APP_ACTIVE || req.query.app_status == Common.APP_DISABLED) {//if the state can be set by a user
                        if (app.us_app_user == req.user._id) res.send(setState(app, req.query.app_status));//check if the app belongs to the currently signed in user before setting it
                    }
                }
            });
    }
};

function setState (app, state) {
    app.ap_app_status = state;
    app.save();
    return app;
}

/**
 * Get applications owned by the authenticated user.
 * @param req
 * @param res
 */
exports.getAppsByUserID = function(req, res) {
    App.find({us_app_user: req.params.id}).exec(function(err, docs) {
        if(err) {
           next(err);
        } else {
            res.send(docs);
        }
    })
};