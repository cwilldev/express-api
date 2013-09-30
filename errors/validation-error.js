/**
 * ValidationError
 *
 * @author Jefferson Sofarelli<jmsofarelli@gmail.com>
 * @author Christopher Will<dev@cwill-dev.con>
 * @date 07-09-2013
 */

// Module requirements
var ApiError = require('./../common/error');

/**
 * Constructor
 *
 * @param {String} msg Error message
 * @inherits ApiError
 */
function ValidationError (msg, errors) {
    var message = msg || "Validation failed";
    ApiError.call(this, message);
    Error.captureStackTrace(this, arguments.callee);
    this.errors = errors || [];
    this.name = 'ValidationError';
    this.statusCode = 400;
}

// Inherits from ApiError
ValidationError.prototype.__proto__ = ApiError.prototype;

/**
 * TODO
 * @param errMsg
 */
ValidationError.prototype.add = function (errMsg) {
    this.errors.push(errMsg);
};

/**
 * Checks wether one or more errors exist.
 *
 * @return {Boolean} True if error(s) exist, false otherwise
 */
ValidationError.prototype.hasErrros = function () {
    return this.errors.length > 0;
};


// Module exports
module.exports = exports = ValidationError;