/**
 * Library for JavaScript OOP Pedants.
 *
 * @author Christopher Will<contact@cwill-dev.com>
 */

/**
 * Constructor and prototype chaining.
 * OOP pretender to use base class inheritance.
 *
 * Notice:
 * That class to implement the extend must have following code IMMEDIATELY
 * AFTER its constructor.
 *
 * @see http://developer.yahoo.com/yui/yahoo/#extend
 *
 * @param subclass {Object} Class to get enhanced by an extended definition
 * @param superclass {Object} The class to inherit from
 */
exports.extend = function(subclass, superclass) {

    // Create dummy wrapper
    function TwentyPrittyGirls() {}

    // Assign superclass's prototype to wrapper
    TwentyPrittyGirls.prototype = superclass.prototype;

    // Wrap subclass to be a instance of FooBar
    subclass.prototype = new TwentyPrittyGirls();

    // Set the constructor
    subclass.prototype.constructor = subclass;

    // Set superclass
    subclass.superclass = superclass;

    // Re-assign prototype two-sided
    subclass.superproto = superclass.prototype;

    // Assign superclass constructor
    if (superclass.prototype.constructor == Object.prototype.constructor) {
        superclass.prototype.constructor = superclass;
    }

};