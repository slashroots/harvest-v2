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
    app.ap_app_status = 'active';
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