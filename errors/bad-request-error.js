/**
 * BadRequestError
 *
 * @author christopher Will<dev@cwill-dev.com>
 * @date 07-15-2013
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
function BadRequestError (msg, msgArgs) {
	var message = msg || "Bad Request!";
	ApiError.call(this, message, msgArgs);
	Error.captureStackTrace(this, arguments.callee);
	this.name = 'BadRequestError';
	this.statusCode = 400;
}

// Inherits from ApiError
BadRequestError.prototype.__proto__ = ApiError.prototype;

// Module exports
module.exports = exports = BadRequestError;