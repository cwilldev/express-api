/**
 * ProviderFactory
 *
 * @author Christopher Will<dev@cwill-dev.com>
 * @date 08-30-2013
 */

// Dependencies
var ApiError = require ('./error');
var fs = require('fs');
var ConfigurationError = ApiError.ConfigurationError;
var Q = require('q');


/**
 * Factory to retrieve the appendant provider implementation.
 *
 * @returns {Object} A provider implementation for given providerType - if exists
 */
exports.getInstance = function (providerType) {
    try {
        var path = './../provider/' + providerType + '-provider';
        return require(path).getInstance();
    }
    catch (e) {
        console.log(e);
        throw new ConfigurationError("Provider '" + providerType + "' not supported");
    }
};