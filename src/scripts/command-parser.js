var CommandParser;

(function(){

    "use strict";

    /**
     * This object is responsible to resolve a given command and fetch argument and option values
     * 
     * @param command
     * @constructor
     */
    CommandParser = function(command){

        var commandSegments = Utils.splitBySpace(command);

        this.command = null;

        this.arguments = {};

        this.options = {};

        if(commandSegments.length === 0){
            throw "Command cannot be empty";
        }
        
        this.command = commandSegments.shift();
        
        this.commandSegments = commandSegments;

    };

    /**
     * Get command name
     *
     * @returns string
     */
    CommandParser.prototype.getCommand = function(){
        return this.command;
    };

    /**
     * Get argument value
     *
     * @param argument
     * @returns {*}
     */
    CommandParser.prototype.getArgument = function(argument){
        return this.arguments[argument];
    };

    /**
     * Get option value
     *
     * @param option
     * @returns string
     */
    CommandParser.prototype.getOption = function(option){
        return this.options[option];
    };

    /**
     * Return command segments without command name in the early parse
     *
     * @returns {*}
     */
    CommandParser.prototype.getCommandSegments = function(){
      return this.commandSegments;
    };

    /**
     * Set new Argument name & value
     *
     * @param name
     * @param value
     * @returns {CommandParser}
     */
    CommandParser.prototype.setArgument = function(name,value){
        this.arguments[name] = value;
        return this;
    };

    /**
     * Set new Option name & value
     *
     * @param name
     * @param value
     * @returns {CommandParser}
     */
    CommandParser.prototype.setOption = function(name,value){
        this.options[name] = value;
        return this;
    };

})();