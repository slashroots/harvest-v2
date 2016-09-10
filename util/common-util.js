/**
 * Created by matjames007 on 9/10/16.
 */

var Crypto = require('crypto');


/**
 * Generates random value based on the Node.js crypto library
 * @returns a 64bit random hex string
 */
exports.getRandomToken = function() {
    return Crypto.randomBytes(64).toString('hex');
};