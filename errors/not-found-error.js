/**
 * NotFoundError
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
function NotFoundError (msg, msgArgs) {
	var message = msg || "Not found error!";
	ApiError.call(this, message, msgArgs);
	Error.captureStackTrace(this, arguments.callee);
	this.name = 'NotFoundError';
	this.statusCode = 404;
}

// Inherits from ApiError
NotFoundError.prototype.__proto__ = ApiError.prototype;

// Module exports
module.exports = exports = NotFoundError;