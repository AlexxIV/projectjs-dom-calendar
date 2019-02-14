var $ = (function () {

    'use strict';

    /**
     * Create the constructor
     * @param {String} selector The selector to use
     */
    var Constructor = function (selector) {
        if (!selector) return;
        if (selector === 'document') {
            this.elems = [document];
        } else if (selector === 'window') {
            this.elems = [window];
        } else {
            this.elems = document.querySelectorAll(selector);
        }
    };


    /**
     * Run a callback on each item
     * @param  {Function} callback The callback function to run
     */
    Constructor.prototype.each = function (callback) {
        if (!callback || typeof callback !== 'function') return;
        for (var i = 0; i < this.elems.length; i++) {
            callback(this.elems[i], i);
        }
        return this;
    };

    /**
     * Insert child node
     */
    Constructor.prototype.append = function(newNode) {
        newNode = createDomElement(newNode);
        return this.each((el) => {
            el.appendChild(newNode);
        });
    };

    /**
     * Insert element before selector
     */
    Constructor.prototype.prepend = function(newNode) {
        newNode = createDomElement(newNode);
        this.each((el) => {
            el.parentNode.insertBefore(
                newNode, el)
        });

        return this;
    };

    Constructor.prototype.parent = function() {
        var temp = [];
        this.each((el) => {
            temp.push(el.parentNode);
        });
        this.elems = temp;
        return this;
    };

    Constructor.prototype.next = function () {
        var temp = [];
        this.each((el) => {
           temp.push(el.nextSibling);
        });
        this.elems = temp;
        return this;
    };

    Constructor.prototype.prev = function () {
        var temp = [];
        this.each((el) => {
            temp.push(el.previousSibling);
        });
        this.elems = temp;
        return this;
    };

    /**
     * Insert element after selector
     */

    Constructor.prototype.appendAfter = function(newNode) {
        newNode = createDomElement(newNode);
        this.each((el) => {
            el.parentNode.insertBefore(
                newNode, el.nextSibling)
        });

        return this;
    };

    Constructor.prototype.remove = function() {

        return this.each((el) => {
            el.parentNode.removeChild(el)
        });
    };

    Constructor.prototype.attr = function(attrName, attrValue) {
        this.each((el) => {
            el.setAttribute(attrName, attrValue);
        });
        return this;
    };

    /**
     * Add a class to elements
     * @param {String} className The class name
     */
    Constructor.prototype.addClass = function (className) {
        this.each(function (item) {
            item.classList.add(className);
        });
        return this;
    };

    /**
     * Remove a class to elements
     * @param {String} className The class name
     */
    Constructor.prototype.removeClass = function (className) {
        this.each(function (item) {
            item.classList.remove(className);
        });
        return this;
    };

    Constructor.prototype.html = function (html) {
        this.each(function (item) {
            item.innerHTML = html;
        })
    };

    /**
     * Return the constructor instantiation
     */
    return function (selector) {
        return new Constructor(selector);
    };

})();

/**
 * Helper Functions
 */
function createDomElement(htmlString) {
    let wrapper= document.createElement('div');
    wrapper.innerHTML= htmlString;
    return wrapper.firstChild;
}