/**
 * CoreProvider.
 * Bundles lowet common denominators of available provider.
 *
 * TODO Description, that core is mostly JSON, because ExpressAPI deal internally with JSON etc pp bla
 *
 * @author Christopher Will<dev@cwill-dev.com>
 */

// Dependencies
var Q = require('q');
var ApiError = require('./../common/error');
var check = require('validator').check;

/**
 * Exports the class definition.
 * May get used for assigning the inheritance of a module class.
 *
 * @returns {CoreProvider} The class reference
 */
exports.getClass = function() {
    return CoreProvider;
};


/**
 * Constructor.
 *
 * @constructor
 */
function CoreProvider() {}


/**
 * Validates request parameters.
 *
 * This method analyses and validates each request parameter based on the particular endpoint
 * configuration..
 *
 * @param requestParams {Object} The request params object
 * @param apiEndpointRequestConf {Object} A specific API endpoint definition
 *
 * @returns {Q.promise} Resolved on valid, rejected otherwise.
 */
CoreProvider.prototype.validateRequestParams = function (requestParams, apiEndpointRequestConf) {

    // Wrap as promise
    var deferred = Q.defer();

    // Store multiple errors
    var ValidationError = new ApiError.ValidationError();

    // Iterate through each configurations
    for (var paramKey in apiEndpointRequestConf['fields']) {

        // Skip internals
        if (!apiEndpointRequestConf['fields'].hasOwnProperty(paramKey)) {
            continue;
        }

        // The configuration for this particular input parameter
        var requestParamConf = apiEndpointRequestConf['fields'][paramKey];

        // TODO
        // Skip validation on files - each route must check on their own.
        // if(undefined != inputConf['isFile'] && true === inputConf['isFile']) {
        //     continue;
        // }

        // Flag if parameter is handled to be optional
        var isOptional = (undefined != requestParamConf['optional'] && true === requestParamConf['optional']);
        console.log("+++++++ TODO Do RECURSIVE (non flattened)");

        // Break if parameter is not optional and does not exist
        if(!isOptional && undefined == requestParams[paramKey])  {
            ValidationError.add( {
                'param': paramKey,
                'type': 'RequiredParam',
                'msg': 'This parameter is required'
            });
            continue;
        }

        // Extract validators
        var validators = [];
        if(undefined != requestParamConf['validator'] && requestParamConf['validator'].length != 0) {
            validators = requestParamConf['validator'];
        }

        // Add default validations for non-optional parameters
        if(!isOptional) {
            validators.push('notNull');
            validators.push('notEmpty');
        }

        // Do the validation - break on any errors
        try {

            // Build string to be evaluated
            var exec = "check('" + requestParams[paramKey] + "')";

            // Iterate through each validator and add braces if none given
            for(var index=0; index < validators.length; index++) {
                var corrected = (validators[index].lastIndexOf(')') != validators[index].length-1) ? validators[index] + '()' : validators[index];
                exec += '.' + corrected;
            }

            // Execute validation chain (skip empty optional parameters)
            if(!isOptional || (isOptional && (requestParams[paramKey] != undefined && requestParams[paramKey].length > 0))) {
                eval(exec); // evil eval go and get me!
            }
        }

            // Append error in case of failure
        catch(error) {
            ValidationError.add( {
                'param': paramKey,
                'type': error.name,
                'msg': error.message
            });
        }
    }

    // If endpoint is in "strict" mode check if request contains not-supported parameters
    if(apiEndpointRequestConf['mode'] == 'strict') {
        for (var requestParamKey in requestParams) {
            if(undefined == apiEndpointRequestConf['fields'][requestParamKey]) {
                ValidationError.add( {
                    'param': requestParamKey,
                    'type': 'UnsupportedParameter',
                    'msg': 'Parameter not allowed'
                });
            }
        }
    }

    // Delegate to failure callback immediately if any error occured
    if(ValidationError.hasErrros()) {
        deferred.reject(ValidationError);
        throw ValidationError;
    }

    // Well, everything went fine
    deferred.resolve(true);
    return deferred.promise;
};


/**
 * Purges all key/value-pairs from the response based on the given API
 * endpoint configuration.
 *
 * TODO Description, that core is mostly JSON, because ExpressAPI deal internally with JSON etc pp bla
 *
 * @param object {JSON} The JSON object to process
 * @param apiEndpointResponseConf {Object} The endpoint configuration for the endpoint response
 */
CoreProvider.prototype.purgeResponseParams = function (object, apiEndpointResponseConf) {

    // Wrap as promise
    var deferred = Q.defer();

    // Equilibrate not-whitelisted fields and remove them accordingly
    var walkObject = function(obj, parentKeys) {

        parentKeys = parentKeys || [];
        for(var key in obj) {

            // Skip internals..
            if (!obj.hasOwnProperty(key)) {
                continue;
            }

            var hasNested = obj[key] !== undefined && obj[key].toString() == "[object Object]";

            var cKeyInclParents = parentKeys.join(".");
            cKeyInclParents += (cKeyInclParents.length>0) ? "." + key : key;

            console.log("Key: " + cKeyInclParents + " = value: " + obj[key]);

            // Go for children
            if(hasNested) {
                parentKeys.push(key);
                walkObject(obj[key], parentKeys);
                parentKeys.pop();
            }

            // TODO Find an appropriate way to prevent ev(i/a)l
            // (even though it is kind of save because just ourself provides the data)
            // What it does: It checks the current key (ie address.street) to exist in
            // the whitelist.
            else {
                var evalArray = "['" + cKeyInclParents + "']";
                evalArray = evalArray.replace(/\./gi,"']['");

                // Check whitelist
                var evalCheckWhitelist = "var exists = undefined != apiEndpointResponseConf['fields']" + evalArray;
                eval(evalCheckWhitelist);

                // Remove from object
                if(!exists) {
                    var evalRemoveField = "delete object" + evalArray;
                    eval(evalRemoveField);
                }
            }
        }
    };

    try {
        walkObject(object);
        deferred.resolve(object)
    }
    catch(error) {
        deferred.reject(error)
    }

    return deferred.promise;
};


/**
 * Main functionality for sending a valid response to the client.
 *
 * @param response {Object} The ExpressJS response instance
 * @param data {Object} The data provided by the correspondent router action
 * @returns {Q.promise} resovled in case of succecss
 */
CoreProvider.prototype.send = function(response, data) {
    var deferred = Q.defer();
    var resData = {};
    resData[response.apiWrapperKey] = data;
    response.send(200, resData);
    deferred.resolve(true);
    return deferred.promise;
};