/**
 * JsonProvider.
 * Implementation of the format: JSON
 *
 * @author Christopher Will<dev@cwill-dev.com>
 * @date 08-30-2013
 */

// Dependencies
var Q = require('q');
var ApiError = require('./../common/error');
var check = require('validator').check;
var Inheritance = require('./../common/inheritance');
var CoreProvider = require('./core-provider');


/**
 * Instantiator.
 *
 * @returns {JsonProvider}
 */
exports.getInstance = function () {
    return new JsonProvider();
};


/**
 * Constructor.
 *
 * @constructor
 */
function JsonProvider() {}

// Extends from CoreProvider
Inheritance.extend(JsonProvider, CoreProvider.getClass());


/**
 * Validates request parameters.
 *
 * This method analyses and validates each request parameter based on the particular endpoint
 * configuration..
 *
 * TODO Description regarindg CoreProvider etc
 *
 * @param requestParams {Object} The request params object
 * @param apiEndpointRequestConf {Object} A specific API endpoint definition
 *
 * @returns {Q.promise} Resolved on valid, rejected otherwise.
JsonProvider.prototype.validateRequestParams = function (requestParams, apiEndpointRequestConf) {
    return this.CoreProvider.validateRequestParams(requestParams, apiEndpointRequestConf);
};
 */


/**
 * Purges all key/value-pairs from the response based on the given API
 * endpoint configuration.
 *
 * TODO Description regarindg CoreProvider etc
 *
 * @param object {JSON} The JSON object to process
 * @param apiEndpointResponseConf {Object} The endpoint configuration for the endpoint response
JsonProvider.prototype.purgeResponseParams = function (object, apiEndpointResponseConf) {
    return this.CoreProvider.purgeResponseParams(object, apiEndpointResponseConf);
};
*/


/**
 * Main functionality for sending a valid response to the client.
 *
 * @param response {Object} The ExpressJS response instance
 * @param data {JSON} The data provided by the correspondent router action
 * @returns {Q.promise} resovled in case of succecss
 */
JsonProvider.prototype.send = function(response, data) {
    var deferred = Q.defer();
    var resData = {};
    resData[response.apiWrapperKey] = data;
    response.json(200, resData);
    deferred.resolve(true);
    return deferred.promise;
};