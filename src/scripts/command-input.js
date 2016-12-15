var CommandInput;

(function(){

    "use strict";

    /**
     *
     * @param name
     * @param value
     * @param required
     * @param isOption
     * @constructor
     */
    CommandInput = function(name,value,required,isOption){

        this.name = name;

        this.required = required;

        this.value = value;

        this._isOption = isOption;
    };

    /**
     * Check if this input is an option that starts with two hyphens (--)
     *
     * @returns {boolean}
     */
    CommandInput.prototype.isOption = function(){
        return this._isOption === true;
    };

    /**
     * Check if this command is required value
     *
     * @returns {boolean}
     */
    CommandInput.prototype.isRequired = function(){
        return this.required === true;
    };

    /**
     * Get the input name
     *
     * @returns string
     */
    CommandInput.prototype.getName = function(){
        return this.name;
    };

    /**
     * Get the input value
     *
     * @returns string
     */
    CommandInput.prototype.getValue = function(){
        return this.value;
    };
    
})();