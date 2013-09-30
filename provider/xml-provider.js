/**
 * XmlProvider.
 * Implementation fo the format: XML
 *
 * @author Christopher Will<dev@cwill-dev.com>
 * @date 08-30-2013
 */

// Dependencies
var Q = require('q');
var ApiError = require ('./../common/error');

/**
 * Instantiator.
 *
 * @returns {XmlProvider}
 */
exports.getInstance = function () {
    return new XmlProvider();
};


/**
 * Constructor.
 *
 * @constructor
 */
function XmlProvider() {
    throw new ApiError.InternalServerError("XML-provider not supported yet")
}