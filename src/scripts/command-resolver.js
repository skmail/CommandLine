var CommandResolver;

(function(){

    "use strict";

    /**
     * This object is responsible to resolve a given command and fetch argument and option names
     *
     * @param command
     * @constructor
     */
    CommandResolver = function(command){

        this.signature = command;

        var commandSegments = Utils.splitBySpace(command);

        this.command = null;

        this.arguments = [];

        this.options = [];

        if(commandSegments.length === 0){
            throw "Command cannot be empty";
        }

        this.command = commandSegments.shift();

        var parsedInput;

        for(var i = 0; i < commandSegments.length;i++){
            parsedInput = this.parseInput(commandSegments[i]);
            if(parsedInput.isOption()){
                this.options.push(parsedInput);
            }else{
                this.arguments.push(parsedInput);
            }
        }

    };

    /**
     * Return command signature
     * 
     * @returns string
     */
    CommandResolver.prototype.getSignature = function(){
        return this.signature;
    };

    /**
     * Assign parsedCommand arguments & options values
     * 
     * @param parsedCommand
     */
    CommandResolver.prototype.dispatch = function(parsedCommand){
        var commandSegments = parsedCommand.getCommandSegments();
        var _options = [];
        var _arguments = [];
        var parsedInput;
        for(var i = 0; i < commandSegments.length;i++){
            parsedInput = this.parseInput(commandSegments[i]);
            if(parsedInput.isOption()){
                _options.push(parsedInput);
            }else{
                _arguments.push(parsedInput);
            }
        }

        /**
         * Provided arguments exceeds the registered command signature arguments
         */
        if(_arguments.length > this.arguments.length ){
            throw [
                this.signature,
                this.command + ' Command arguments not recognized.'
            ];
        }

        /**
         * Some arguments is required
         */
        for(var argumentIndex = 0 ; argumentIndex < this.arguments.length;argumentIndex++){
            if(this.arguments[argumentIndex].isRequired() && typeof _arguments[argumentIndex] == 'undefined'){
                throw [
                    this.signature,
                    this.arguments[argumentIndex].getName() + ' Argument Is required.'
                ];
            }

            /**
             * Assign arguments names and values to the parsed Command arguments
             */
            if(_arguments[argumentIndex]){
                parsedCommand.setArgument(this.arguments[argumentIndex].getName(),_arguments[argumentIndex].getName());
            }else{
                parsedCommand.setArgument(this.arguments[argumentIndex].getName(),this.arguments[argumentIndex].getValue());
            }
        }

        /**
         * Assign options names and values to the parsed Command options
         */
        for(var resolvedOptionIndex = 0 ; resolvedOptionIndex < this.options.length;resolvedOptionIndex++){
            parsedCommand.setOption(this.options[resolvedOptionIndex].getName().substring(2),this.options[resolvedOptionIndex].getValue());
        }

        /**
         * Assign options names and values that provided by user to the parsed Command options
         */
        for(var parsedOptionIndex = 0 ; parsedOptionIndex < _options.length;parsedOptionIndex++){
            parsedCommand.setOption(_options[parsedOptionIndex].getName().substring(2),_options[parsedOptionIndex].getValue());
        }

    };

    /**
     * Get signature command name
     * 
     * @returns string
     */
    CommandResolver.prototype.getCommand = function(){
        return this.command;
    };

    /**
     * Get signature arguments
     *
     * @returns {Array}
     */
    CommandResolver.prototype.getArguments = function(){
        return this.arguments;
    };

    /**
     * Get signature option
     *
     * @returns {Array}
     */
    CommandResolver.prototype.getOptions = function(){
        return this.options;
    };

    /**
     * Parse given input and instantiate a CommandInput object
     * The may be an argument input or option input
     * 
     * @param input
     * @returns {CommandInput}
     */
    CommandResolver.prototype.parseInput = function(input){

        var required = false,
            value = null,
            name;

        var inputSegments = input.split('=');

        var isOption = (Utils.startsWith(input,'--') === true);

        name = inputSegments.shift();

        if(isOption === false && Utils.endsWith(name,'?') !== true){
            required = true;
        }

        if(isOption === false && Utils.endsWith(name,'?') === true){
            name = name.slice(0, -1);
        }

        if(inputSegments.length > 0 ){
            value = inputSegments.join('');
        }

        if(value && Utils.startsWith(value,'"') === true && Utils.endsWith(value,'"') === true){
            value = value.slice(1);
            value = value.slice(0, -1);
        }

        return new CommandInput(name,value,required,isOption);

    };

})();