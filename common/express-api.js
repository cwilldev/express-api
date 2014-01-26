/**
 * ExpressAPI
 *
 * @author Christopher Will<dev@cwill-dev.com>
 */

// Dependencies
var Q = require('q');
var domain = require('domain');
var fs = require('fs');
var wrench = require('wrench');
var ApiError = require('./error');
var InternalServerError = ApiError.InternalServerError;
var NotFoundError = ApiError.NotFoundError;
var BadRequestError = ApiError.BadRequestError;


/**
 * Initializes the ExpressAPI module.
 *
 * @param app {Object} The Express.js instance
 * @param config {JSON} ExpressAPI configuration file
 *
 * @returns {ExpressApi}
 */
exports.getInstance = function (app, config) {
    return new ExpressApi(app, config);
};


/**
 * Constructor.
 * Initializes locally required objects.
 *
 * @param app {Object} The Express.js instance
 * @param config {JSON} ExpressAPI configuration file
 *
 * @constructor
 */
function ExpressApi(app, config) {

    // Input parameter validation
    if (undefined === app || undefined === config) {
        throw new InternalServerError("Invalid usageof EpxressAPI. Please pass both the expess instance and the configuration.");
    }

    // Assign member variables
    this.ExpressApp = app;
    this.ExpressConfig = config;
    this.RequestHelper = require('./../helper/request-helper').getInstance();

    // Setup the endpoints on initialization
    this.init();
}


/**
 * Configure endpoints.
 *
 * This method iterates through all provided endpoint files located in the given
 * endpoint directory, recursively.
 * Each endpoint definition may contain one or more named routes (ie /foobar/) and
 * several child verb-definitions (ie GET:/foobar/, PUT:/foobar/). Each of the
 * child-verbs may be specified to only be available in a particular environment
 * setup. This code takes care of these configurations.
 *
 * If no endpoint directory provided the default location gets used: ./conf/apsi/.
 *
 * Notice:
 * This is the very first method to be called in the middleware section of the
 * express application.
 */
ExpressApi.prototype.init = function () {

    // Variables
    var self = this;

    // Here we are
    console.log('ExpressAPI: Configuring API endpoints');

    // Routes directory
    var routesDir = ((this.ExpressConfig["endpoints"]["routes"]["relative"] === true ? process.cwd() : '') +
        this.ExpressConfig["endpoints"]["routes"]["path"])
        .replace(/\/?$/, '/'); // Trailing slash;
    console.log('. Routes directory: ' + routesDir);

    // Either use provided or default endpoint directory
    var endpointDir = ((this.ExpressConfig["endpoints"]["configurations"]["relative"] === true ? process.cwd() : '') +
        this.ExpressConfig["endpoints"]["configurations"]["path"])
        .replace(/\/?$/, '/'); // Trailing slash;
    console.log('. Endpoints directory: ' + endpointDir);

    // Receive all andpoint definition filenames (recursively)
    var endpointFilenames = wrench.readdirSyncRecursive(endpointDir);

    // Iterate through each endpoint definition
    for (var i = 0; i < endpointFilenames.length; i++) {

        var fileName = endpointDir + endpointFilenames[i];

        // Skip directories
        if (fs.lstatSync(fileName).isDirectory()) {
            continue;
        }

        // Read one by one
        var endpointDefinitions = require(fileName);

        // Iterate through each route (ie /foobar/)
        for (var routeName in endpointDefinitions) {

            // Skip built-in meta properties
            if (!endpointDefinitions.hasOwnProperty(routeName)) {
                continue;
            }

            // Log what we are doing
            console.log('. Processing "' + routeName + '"');

            // Persist on application layer
            this.ExpressApp.set(routeName, endpointDefinitions[routeName]);

            // Iterate through each method types (ie GET, POST)
            for (var routeVerb in endpointDefinitions[routeName]) {

                // Skip built-in meta information
                if (!endpointDefinitions[routeName].hasOwnProperty(routeVerb)) {
                    continue;
                }

                // Contains the detailled configuration of a particular endpoint (ie GET:/foobar/)
                var configuration = endpointDefinitions[routeName][routeVerb];

                // Skip if disabled
                if(endpointDefinitions[routeName][routeVerb]["disabled"] === true) {
                    console.log('. . Skipped "' + routeVerb + ':' + routeName + '". Endpoint is disabled');
                    continue;
                }

                // Skip if not supported in current environment
                if (configuration["env"] != "*" && configuration["env"].indexOf(this.ExpressApp.get('env')) == -1) {
                    console.log('. . Skipped "' + routeVerb + ':' + routeName + '". Environment "' + this.ExpressApp.get('env') + '" not supported');
                    continue;
                }

                // Require route (ie foobar-route)
                var route;
                try {
                    route = require(routesDir + configuration['route']['file']);
                }
                catch(err) {
                    console.log('. . Skipped "' + routeVerb + ':' + routeName + '". Route "' + configuration['route']['file'] + '" does not exist');
                    continue;
                }

                // If target action does not exist skjp this andpoint
                if (typeof route[configuration['route']['action']] !== 'function') {
                    console.log('. . Skipped "' + routeVerb + ':' + routeName + '". Route "' + configuration['route']['file'] + '.' + configuration['route']['action'] + '" does not exist');
                    continue;
                }

                // Point to action
                // Thanks to Nicolas Traeder<traeder@codebility.com>
                // TODO Anonymous wrapper for onEndpointRequested may be redundant
                this.ExpressApp[routeVerb.toLowerCase()](routeName, function (req, res, next) {
                    return self.onEndpointRequested(req, res, next);
                }, route[configuration['route']['action']]);

                // Log that we are done
                console.log('. . Published "' + routeVerb + ':' + routeName + '". Route "' + configuration['route']['file'] + '.' + configuration['route']['action'] + '"');
            }
        }
    }

    // Configuration finished
    console.log('ExpressAPI: Up and running');
};


/**
 * Event handler to get called while processing a particular endpoint.
 *
 * This method represents the main logic of dealing with a sepcific endpoint on
 * request.
 *
 * @param request {Object} The Express.js request instance
 * @param response {Object} The Express.js response instance
 * @param next {Object} Callback
 */
ExpressApi.prototype.onEndpointRequested = function (request, response, next) {

    try {

        // Grab initially (at app-start) cached endpoint from application container
        var apiEndpoint = this.ExpressApp.get(request.route.path);

        // Validate endpoint
        if (undefined == apiEndpoint || undefined == apiEndpoint[request.method]) {
            next(new BadRequestError("Invalid endpoint"));
        }

        // Get the current endpoint based on the HTTP-verb (request-method)
        var apiVerbEndpoint = apiEndpoint[request.method]; // ie GET {..} or POST {..}

        // Get request params based on HTTP method
        var requestParams = this.RequestHelper.getRequestParams(request);

        // Add current endpoint to request
        request.apiEndpoint = apiVerbEndpoint;

        // Make the wrapper keys accessible for others
        request.apiWrapperKey = this.ExpressConfig.request.wrapper.key;
        response.apiWrapperKey = this.ExpressConfig.response.wrapper.key;
        request.apiData = requestParams;

        // Get provider on the fly using the format-factory
        var Provider = require('./provider-factory').getInstance(request.apiEndpoint['request']['provider'] || 'json');

	
        // Sanitize data and send to client
        if (request.apiEndpoint['response']['novalidate'] == true) {
          Provider.send(response, data)
          return;
        }		

        // Validate request parameter
        Provider.validateRequestParams(requestParams, apiVerbEndpoint['request'])

            // TODO Authorization
            //.then(function() {
            //    return OAuth2, Passport etc
            //})

            .then(function () {
                next();
            })
            .fail(function (error) {
                next(error);
            });
    }

    // Supposed to never happen.. but just God knows (No, he doesn't <sic>)
    catch (error) {
        next(error);
    }
};


/**
 * Send the response to the client.
 *
 * This method assumes that the request was valid and no error did occur - so it will always
 * return 200 as HTTP status code.
 * In any other case it delegates to the error-callback.
 *
 * Before sending the response to the client it automatically sanitizes the data to be
 * responded, based on the particular endpoint definition configuration of the current
 * request.
 * The data to be responded must be previously assigned to the data-property of the
 * Express.js request object (request[request.apiWrapperKey]).
 *
 * Notice:
 * This is the very last method to be called in the middleware section of the express
 * application.
 */
ExpressApi.prototype.process = function () {

    /**
     * @param request {Object} The Express.js request instance
     * @param response {Object} The Express.js response instance
     * @param next {Object} Callback
     */
    return function (request, response, next) {

        // Suppose to never happen, but we seek to always response ExpressAPI errors
        if (undefined == response) {
            next(new InternalServerError("No response"))
        }

        // Endpoint not supported
        if (undefined == request.apiEndpoint) {
            next(new NotFoundError('Invalid API endpoint'))
        }

        // Create empty array if no data set
        // ExpressAPI assumes all data to be responded is provided as a property of the
        // express.js response - which key is configured in the express-api configuration
        var data = response.apiData || {};

        // Get format implementation by factory
        var Provider = require('./provider-factory').getInstance(request.apiEndpoint['response']['provider'] || 'json');

        // Sanitize data and send to client
        Provider.purgeResponseParams(data, request.apiEndpoint['response'])
            .then(function (cleanedData) {
                Provider.send(response, cleanedData)
            })
            .fail(function (error) {
                next(error)
            });
    }
};


/**
 * Returns a middleware function for error handling
 * Depending on the type of the error, sets a different response HTTP code
 *
 * @author Jefferson Sofarelli<jmsofarelli@gmail.com>
 * @returns {Function} The function to be used as middleware
 */
ExpressApi.prototype.errorHandler = function () {

    return function (err, req, res, next) {

        // Resolved message for the error
        var message = err.message/*Key*/;

        // TODO Pipe?
        console.log(err.stack);

        // Array of objects representing nested errors
        var errors = err.errors || [];

        // Add to response
        res.status(err.statusCode || 400);

        // TODO Support other formats (ie XML) as error response
        // - Make it configurable via express-api.$ENV..config
        // - Use existing provider
        res.json({
            Error: {
                message: message,
                errors: errors
            }
        });
    }
};
