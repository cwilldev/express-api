/**
 * ServiceUnavailableError
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
 * @param {Array} msgArgs Error message arguments
 * @inherits ApiError
 */
function ServiceUnavailableError(msg, msgArgs) {
 	var message = msg || 'Server Unavailable!';
	ApiError.call(this, message, msgArgs);
	Error.captureStackTrace(this, arguments.callee);
	this.name = 'ServiceUnavailableError';
	this.statusCode = 503;
}

// Inherits from ApiError
ServiceUnavailableError.prototype.__proto__ = ApiError.prototype;

// Module exports
module.exports = exports = ServiceUnavailableError;