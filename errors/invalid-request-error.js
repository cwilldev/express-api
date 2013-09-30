/**
 * InvalidRequestError
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
function InvalidRequestError (msg, msgArgs) {
	var message = msg || "Invalid request!";
	ApiError.call(this, message, msgArgs);
	Error.captureStackTrace(this, arguments.callee);
	this.name = 'InvalidRequestError';
	this.statusCode = 400;
}

// Inherits from ApiError
InvalidRequestError.prototype.__proto__ = ApiError.prototype;

// Module exports
module.exports = exports = InvalidRequestError;