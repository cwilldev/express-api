/**
 * RequestHelper.
 *
 * @author Christopher Will<dev@cwill-dev.com>
 * @date 07-08-2013
 */

// Dependencies
var ApiError = require ('./../common/error');
var Q = require('q');


/**
 * Instantiator.
 *
 * @returns {RequestHelper}
 */
exports.getInstance = function () {
    return new RequestHelper();
};


/**
 * Constructor.
 *
 * @constructor
 */
function RequestHelper() {
    //
}


/**
 * Returns parameters independing on request type (like POST, GET, PUT or DELETE).
 *
 * @param request {Request} The request of the current scope
 * @returns {Object} Key/value pairs
 */
RequestHelper.prototype.getRequestParams = function (request) {

    // HTTP - GET
    if(request.method == 'GET') {
        return request.query;
    }

    // HTTP - POST
    // HTTP - PUT
    if(request.method=='PUT' || request.method=='POST') {
        return request.body.data || {};
    }

    // TODO Implement
    var error = new Error("DELETE type not supported yet");
    console.log(error);
    console.log(error.stack);
    return {};
};
