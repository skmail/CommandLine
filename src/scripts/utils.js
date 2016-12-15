var Utils = {};

(function(){
    "use strict";

    /**
     * Array loop
     *
     * @param elements
     * @param callback
     */
    Utils.each = function(elements,callback){
        if(typeof elements === 'string'){
            elements = document.querySelectorAll(elements);
        }
        for(var i = 0; i< elements.length; i++){
            if(typeof callback === 'function'){
                callback(i,elements[i]);
            }
        }
    };

    /**
     * Add class on html element
     *
     * @param element
     * @param className
     */
    Utils.addClass = function (element, className) {
        if (!Utils.hasClass(element, className)) {
            element.className += ' ' + className;
            element.className = element.className.replace(/ +(?= )/g,'').trim();
        }
    };

    /**
     * Check if html element has certain class
     *
     * @param element
     * @param classname
     * @returns {boolean}
     */
    Utils.hasClass = function(element,classname){
        classname = " " + classname + " ";
        if(!element){
            return false;
        }
        if ( (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + classname + " ") > -1 ) {
            return true;
        }
        return false;
    };

    /**
     * Remove class from html element
     * @param node
     * @param className
     */
    Utils.removeClass = function(node,className) {
        node.className = node.className.replace(
            new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g'),
            '$1'
        ).replace(/ +(?= )/g,'').trim();
    };

    /**
     * merge to object into new object
     *
     * @param defaults
     * @param options
     * @returns {{}}
     */
    Utils.extend = function (defaults, options) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    };

    /**
     * http://stackoverflow.com/questions/646611/programmatically-selecting-partial-text-in-an-input-field
     *
     * @param field
     * @param start
     * @param end
     */
    Utils.inputSelectionRange = function(field, start, end) {
        if( field.createTextRange ) {
            var selRange = field.createTextRange();
            selRange.collapse(true);
            selRange.moveStart('character', start);
            selRange.moveEnd('character', end);
            selRange.select();
            field.focus();
        } else if( field.setSelectionRange ) {
            field.focus();
            field.setSelectionRange(start, end);
        } else if( typeof field.selectionStart !== 'undefined' ) {
            field.selectionStart = start;
            field.selectionEnd = end;
            field.focus();
        }
    };

    /**
     * Check if element is a children of given element of is the same element.
     *
     * @param child
     * @param parent
     * @returns {boolean}
     */
    Utils.isDescendantOrSelfOf = function (child,parent) {
        if (child == parent) {
            return true;
        }
        var node = child.parentNode;
        while (node !== null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };


    /**
     *
     * Create div element and append  to to exists element
     *
     * @param className
     * @param $parent
     * @returns {Element}
     */
    Utils.createElementAndAppendIt = function(className,$parent, type){
        if(!type){
            type = 'div';
        }
        var element = document.createElement(type);
        element.className = className;
        $parent.appendChild(element);
        return element;
    };

    /**
     *
     * @param string
     * @returns {*}
     */
    Utils.splitBySpace = function(string){
        return string.match(/(?:[^\s"]+|"[^"]*")+/g);
    };

    /**
     * Check if string starts with certain string
     *
     * @param string
     * @param startsWith
     * @returns {boolean}
     */
    Utils.startsWith = function(string,startsWith){
        return string.indexOf(startsWith) === 0;
    };

    /**
     * Check if string ends with certain string
     *
     * @param string
     * @param endsWith
     * @returns {boolean}
     */
    Utils.endsWith = function(string,endsWith){
        return string.indexOf(endsWith, string.length - endsWith.length) !== -1;
    };

    Utils.strRepeat = function(str,times){
        var output = '';
        for(var i = 0; i < times;i++){
            output+=str;
        }
        return output;
    };


    /**
     * Place the cursor  at the end of a contentEditable
     * @param el
     */
    Utils.placeCaretAtEnd = function (el) {
        el.focus();
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    };

})();