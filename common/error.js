/**
 * ApiError - Base Error class
 *
 * @author Jefferson Sofarelli<jmsofarelli@gmail.com>
 * @author Christopher Will<dev@cwill-dev.com>
 * @date 07-09-2013
 */

/**
 * Constructor
 *
 * @param {String} msg Error message
 * @inherits Error https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error
 */
function ApiError (msg, msgArgs) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = msg;
  this.messageArgs = msgArgs;
  this.name = 'ApiError';
}

// Inherits from Error.
ApiError.prototype.__proto__ = Error.prototype;

// Module exports.
module.exports = exports = ApiError;

// Expose subclasses
ApiError.AuthenticationError = require('./../errors/authentication-error');
ApiError.BadRequestError = require('./../errors/bad-request-error');
ApiError.ConfigurationError = require('./../errors/configuration-error');
ApiError.InternalServerError = require('./../errors/internal-server-error');
ApiError.InvalidRequestError = require('./../errors/invalid-request-error');
ApiError.NotFoundError = require('./../errors/not-found-error');
ApiError.ServiceUnavailableError = require('./../errors/service-unavailable-error');
ApiError.ValidationError = require('./../errors/validation-error');