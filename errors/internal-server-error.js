/**
 * InternalServerError
 *
 * @author Jefferson Sofarelli<jmsofarelli@gmail.com>
 * @author christopher Will<dev@cwill-dev.com>
 * @date 07-10-2013
 */

// Module requirements
var ApiError = require('./../common/error');

/**
 * Constructor
 *
 * @param {String} msg Error message
 * @inherits ApiError
 */
function InternalServerError (msg) {
    var message = msg || "Internal Server Error!";
    ApiError.call(this, message);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'InternalServerError';
    this.statusCode = 500;
}

// Inherits from ApiError
InternalServerError.prototype.__proto__ = ApiError.prototype;

// Module exports
module.exports = exports = InternalServerError;