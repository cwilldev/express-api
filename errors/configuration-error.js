/**
 * ConfigurationError
 *
 * @author christopher Will<dev@cwill-dev.com>
 * @date 08-30-2013
 */

// Module requirements
var ApiError = require('./../common/error');

/**
 * Constructor
 *
 * @param {String} msg Error message
 * @inherits ApiError
 */
function ConfigurationError (msg) {
    var message = msg || "Configuration Error!";
    ApiError.call(this, message);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'InternalServerError';
    this.statusCode = 500;
}

// Inherits from ApiError
ConfigurationError.prototype.__proto__ = ApiError.prototype;

// Module exports
module.exports = exports = ConfigurationError;