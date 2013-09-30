/**
 * AuthenticationError
 *
 * @author Jefferson Sofarelli<jmsofarelli@gmail.com>
 * @author Christopher Will<dev@cwill-dev.con>
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
function AuthenticationError (msg, msgArgs) {
 	var message = msg || 'Authentication Error!';
	ApiError.call(this, message, msgArgs);
	Error.captureStackTrace(this, arguments.callee);
	this.name = 'AuthenticationError';
	this.statusCode = 401;
}

// Inherits from ApiError
AuthenticationError.prototype.__proto__ = ApiError.prototype;

// Module exports
module.exports = exports = AuthenticationError;