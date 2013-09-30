/**
 * HTTP Authentication module.
 *
 * @author Christopher Will<dev@cwill-dev.com>
 * @date 07-03-2013


// Inheritance and module base class affairs
var Inheritance = undefined; //require('../src/common/oop/inheritance');
var HwBaseModule = undefined; //require('../src/common/modules/hw-base-module');
var HwError = undefined; //require('../errors/hw-error');
var HwInternalServerError = undefined; //ApiError.ApiInternalServerError;
var HwBadRequestError = undefined; //ApiError.HwBadRequestError;
var HwAuthenticationError = undefined; //ApiError.HwAuthenticationError;
var HwValidationError = undefined; //ApiError.HwValidationError;
*/

/**
 * The Q modul for implementing promises.
 *
 * @see https://github.com/kriskowal/q/blob/master/README.md
 * @type {q}

var Q = require('q');
var check = require('validator').check;
*/

/**
 * Instantiator.
 *
 * @returns {ApiPassport}

exports.getInstance = function () {
    return new ApiPassport();
};
*/

/**
 * Class that handles authentication issues.
 *
 * @constructor

function ApiPassport() {}

// Extend from HwBaseModule object
Inheritance.extend(ApiPassport, HwBaseModule.getClass());
*/

/**
 * Dependency injection.
 * This module requires other modules to work with.

ApiPassport.prototype.init = function () {
    this.HwSessionManagerModule = this.factory.getInstance('hw-session-manager-module');
    this.HwJsonModule = this.factory.getInstance('hw-json-module');
};
*/

/**
 * Configures domain.
 * At this point we must assume an active domain is running and wrapping the request.
 * The domain must have the root-property called "request" defined.
 *
 * Notice:
 * This does not include any authorization.
 *
 * @param request {express.request} Current request
 * @param apiEndpoint {Object} API configuration for a specific endpoint (ie starting from [/merchant/me/:email][GET])

ApiPassport.prototype.registerRequest = function(request, apiEndpoint) {

    var deferred = Q.defer();

    // Set acccess-token
    if(undefined != request.headers && undefined != request.headers['hw-access-token']) {
        request.hwAccessToken = request.headers['hw-access-token']
    }

    // Set endpoint configuration
    if(undefined == apiEndpoint) {
        deferred.reject(new HwBadRequestError("No endpoint definition given"));
        return deferred.promise;
    }
    request.apiEndpoint = apiEndpoint;

    // Set current user if access token exists)
    if(undefined != request.hwAccessToken) {
        this.HwSessionManagerModule.get(this.HwSessionManagerModule.getSessionHashKey(request.hwAccessToken))
            .then(function(HwUser) {
                request.currentUser = JSON.parse(HwUser);
                deferred.resolve(true);
            })
            .fail(function() {
                deferred.reject(new HwAuthenticationError("Access-token is invalid!"));
            });
    } else {
        deferred.resolve(true);
    }


    // We are done
    return deferred.promise;
};
*/

/**
 * Checks the authorization on current request.
 *
 * At this point we must assume an active domain is running and wrapping the request.
 * The domain must have both the root-property called "request" and "hwAccessToken" defined.
 *
 * @param request {express.request} Current request
 * @param apiEndpoint {Object} The API endpoint configuration for the currrent request
 * @returns {Q.promise} Rejected if unauthorized, resolved otherwise

ApiPassport.prototype.authorizeRequest = function (request, apiEndpoint) {

    var deferred = Q.defer();

    // Role definitions of the current endpoint
    var allowedRoles = apiEndpoint['auth']['roles'];

    // Public access if no roles are configured for the api endpoint
    if(allowedRoles.length==0) {
        deferred.resolve(true);
        return deferred.promise;
    }

    // If wildcard provided set all available roles
    if(allowedRoles=="*") {
        allowedRoles = ['HW-MERCHANT','HW-PLAYER','HW-ADMIN','HW-MODERATOR']
    }

    // Get user by hw-access-token
    if(undefined == request.currentUser) {
        deferred.reject(new HwAuthenticationError('No entity logged in.'))
    }

    // Check if HwUser contains the required role
    else if(allowedRoles.indexOf(request.currentUser.role)==-1) {
        deferred.reject(new HwAuthenticationError('Invalid role'));
    }

    // Everything is fine, the HwUser is authorized to process this endpoint.
    else {
        deferred.resolve(true);
    }

    return deferred.promise;
};
*/

/**
 * Returns - if exists (=logged in) - user belonging to given hwAccessToken.
 *
 * @param hwAccessToken {String} The hw-access-token
 * @return {Q.promise} with {HwPlayer|HwMerchant|HwAdmin|HwModerator|HwGamer}

ApiPassport.prototype.getUser = function (hwAccessToken) {
    return this.HwSessionManagerModule.get(this.HwSessionManagerModule.getSessionHashKey(hwAccessToken))
        .then(function(hwUser) {
            return JSON.parse(hwUser)
        })
        .fail(function(error) {
            throw error;
        });
};
*/

/**
 * Updates the current logged in user by replacing it's redis data with the
 * new one.
 *
 * @param request {express.request} Current request
 * @param HwUser {HwMerchant|HwPlayer|HwUser} The HwUser
 * @returns {Q.promise} with {HwMerchant|HwPlayer|HwUser}

ApiPassport.prototype.updateCurrentUser = function (hwAccessToken, HwUser) {
    var deferred = Q.defer();
    var HwSessionManagerModule = this.HwSessionManagerModule;
    var sessionKey = HwSessionManagerModule.getSessionHashKey(hwAccessToken);
    var jsonUser = JSON.stringify(HwUser);
    HwSessionManagerModule.set(sessionKey, jsonUser)
        .then(function() {
            deferred.resolve(HwUser);
        })
        .fail(function(error) {
            deferred.reject(new HwInternalServerError("Could not update user in memory."))
        });

    return deferred.promise;
};
*/

/**
 * Returns the hw-access-token of the current logged in user.
 *
 * @param request {express.request} Current request
 * @returns {Q.promise} with {String}

ApiPassport.prototype.getHwAccessToken = function (request) {
    var deferred = Q.defer();
    if(undefined != request.hwAccessToken) {
        deferred.resolve(hwAccessToken)
    }
    else {
        deferred.reject(new HwAuthenticationError("No entity logged in"))
    }
    return deferred.promise;
};
*/

/**
 * Purges (removes) all NOT ALLOWED values from the response - namely all key/value-pairs
 * that are NOT listed in the API endpoint definition.
 *
 * @param request {express.request} The request object
 * @param data {Object|Array|JSON} The data to be purged based on interchange policies.

ApiPassport.prototype.filter = function (data, apiEndpoint) {
    if(undefined == apiEndpoint) {
        var deferred = Q.defer();
        deferred.reject(new HwBadRequestError("No API endpoint defined"));
        return deferred.promise;
    }
    return this.HwJsonModule.whitelist(data, apiEndpoint.output);
};
 */