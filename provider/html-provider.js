/**
 * HtmlProvider.
 * Implementation of the provider: HTML
 *
 * @author Christopher Will<dev@cwill-dev.com>
 * @date 08-30-2013
 */

// Dependencies
var Q = require('q');
var ApiError = require ('./../common/error');
var Inheritance = require('./../common/inheritance');
var CoreProvider = require('./core-provider');


/**
 * Instantiator.
 *
 * @returns {HtmlProvider}
 */
exports.getInstance = function () {
    return new HtmlProvider();
};


/**
 * Constructor.
 *
 * @constructor
 */
function HtmlProvider() {}

// Extends from CoreProvider
Inheritance.extend(HtmlProvider, CoreProvider.getClass());


/**
 * The HTML provider does not support (yet?) HTML responses to be purged.
 *
 * @param object {Object} The HTML to process
 * @param apiEndpointResponseConf {Object} The endpoint configuration for the endpoint response
 */
HtmlProvider.prototype.purgeResponseParams = function (object, apiEndpointResponseConf) {
    var deferred = Q.defer();
    deferred.resolve(object);
    return deferred.promise;
};


/**
 * Main functionality for sending a valid response to the client.
 *
 * @param response {Object} The ExpressJS response instance
 * @param data {JSON} The data provided by the correspondent router action
 * @returns {Q.promise} resovled in case of succecss
 */
HtmlProvider.prototype.send = function(response, data) {
    var deferred = Q.defer();
    response.send(200, data);
    deferred.resolve(true);
    return deferred.promise;
};