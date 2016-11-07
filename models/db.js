/**
 * As a guiding principle - each table must have a state... this allows us to deactivate (but not delete!)
 * Created by matjames007 on 9/10/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/mongodb");

/**
 * Intended to be used for the Application Manager.  Tokens are not given to the users
 * but are instead assigned to an application that is created by the user.
 */
var AppSchema = new Schema({
    ap_app_name: {type: String, required: true, unique: false},
    ap_app_desc: {type: String},
    ap_app_token: {type: String, required: true},
    us_app_user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    ap_app_creation_date: {type: Date, default: Date.now()},
    ap_app_status: {type: String,required: true, default: 'active'}, //allows administrator to deactivate access
    ap_app_role: {type: Schema.Types.ObjectId, required: true, ref: "Role"}
    /*
    TODO: we had issues the last time on the servers with Date.now();  Need to test this and make sure it is functional
     */
});

/**
 * Users are capable of being tracked throughout the system.  Each user has an assigned role,
 * and state.  The state of a user changes based on the registration with the system and if
 * an administrator wants to deactivate the account.
 */
var UserSchema = new Schema({
    us_user_first_name: {type: String, required: true},
    us_user_last_name: {type: String, required: true},
    us_username: {type: String, unique: true, required: true},
    us_password: {type: String, required: true},
    us_email_address: {type: String, required: true},
    us_contact: {type: String, required: true},
    us_user_creation_date: {type: Date, default: Date.now()},
    us_state: {type: String, default: 'pending'},
    us_address: {type: String, required: true},
    us_company: {type: String, required: false},
    us_intended_use: {type: String, required: false},
    us_user_role: {type: Schema.Types.ObjectId, required: true, ref: "Role"},
    us_activation_token: {type: String, required: true}
});

/**
 * Very basic role schema to allow administrators to create or update roles but not delete.
 * A state can be set to achieve the same thing.
 */
var RoleSchema = new Schema({
    ro_role_name: {type: String, required: true, unique: true},
    ro_role_desc: {type: String},
    ro_creation_date: {type: Date, default: Date.now()},
    ro_role_state: {type: String, default: 'active'}
});

exports.Role = mongoose.model('Role', RoleSchema);
exports.User = mongoose.model('User', UserSchema);
exports.App = mongoose.model('Application', AppSchema);
