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
var CommandPrompt;

(function(){

    "use strict";

    /**
     * 
     * @param commandLine
     * @param title
     * @param confirmCallback
     * @constructor
     */
    CommandPrompt = function(commandLine,title,confirmCallback){
        this.title = title;
        this.confirmCallback = confirmCallback;
        this.commandLine = commandLine;
        this.start();
    };

    /**
     * Start/Restart prompt message
     */
    CommandPrompt.prototype.start = function(){
        var $self = this;
        if(this.commandLine.commandRow){
            this.commandLine.commandRow.disable();
        }
        this.commandLine.commandRow = new CommandRow(this.commandLine,function(value){
            $self.confirmCallback.apply($self,[value]);
        });
        this.commandLine.commandRow.hideUser();
        this.commandLine.commandRow.setProtectedEntry(this.title);
        this.commandLine.commandRow.isolate(true);
    };

    /**
     * Set prompt title
     */
    CommandPrompt.prototype.setTitle = function(title){
        this.title = title;
        return this;
    };

})();
var CommandSecret;

(function(){

    "use strict";

    /**
     * 
     * @param commandLine
     * @param title
     * @param confirmCallback
     * @constructor
     */
    CommandSecret = function(commandLine,title,confirmCallback){
        this.title = title;
        this.confirmCallback = confirmCallback;
        this.commandLine = commandLine;
        this.start();
    };

    /**
     * Replace visible text with Asterisk
     */
    CommandSecret.prototype.start = function(){

        if(this.commandLine.commandRow){
            this.commandLine.commandRow.disable();
        }
        this.commandLine.commandRow = new CommandRow(this.commandLine,function(value){return value;});
        this.commandLine.commandRow.hideUser();
        this.commandLine.commandRow.setProtectedEntry(this.title);

        var $self = this;
        this.element = Utils.createElementAndAppendIt('secret',this.commandLine.commandRow.commandRow,'input');
        this.element.focus();

        this.element.addEventListener('keyup',function(){
            $self.commandLine.commandRow.commandEntry.innerHTML = Utils.strRepeat('*',this.value.length);
        },false);

        this.element.addEventListener('keydown',function(e){
            if (e.keyCode == 13) {
                e.preventDefault();
                var value = this.value;
                $self.element.parentNode.removeChild($self.element);
                delete $self.element;
                $self.confirmCallback.apply($self,[value]);
            }
        },false);

        $self.commandLine.commandRow.disable();
        
        this.commandLine.commandRow.isolate(true);

    };

    /**
     * Set prompt title
     */
    CommandSecret.prototype.setTitle = function(title){
        this.title = title;
        return this;
    };



})();
var CommandRow;

(function(){

    "use strict";

    /**
     *
     * @param commandLine
     * @param onEnterCallback
     * @constructor
     */
    CommandRow = function(commandLine,onEnterCallback){

        var $self = this;

        this.commandLine = commandLine;

        this.container = commandLine.container;
        
        this.commandRow = Utils.createElementAndAppendIt('command-row active',this.container);

        this.commandTime = Utils.createElementAndAppendIt('command-time',this.commandRow);

        var currentDate = new Date();
        var time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

        this.commandTime.innerHTML = '[' + time + ']';

        this.commandUser = Utils.createElementAndAppendIt('command-user',this.commandRow);
        this.commandUser.innerHTML = this.commandLine.username + '$';

        this.commandEntryProtected = Utils.createElementAndAppendIt('command-entry command-entry-protected',this.commandRow);

        this.commandEntry = Utils.createElementAndAppendIt('command-entry',this.commandRow);
        this.commandEntry.contentEditable = true;
        this.commandEntry.focus();

        Utils.placeCaretAtEnd(this.commandEntry);

        this.commandEntryKeyDownCallback = function (e){
            if (e.keyCode == 13) {
                e.preventDefault();
                this.contentEditable = false;
                this.removeEventListener('keydown',$self.commandEntryKeyDownCallback);
                onEnterCallback(this.textContent);
                return false;
            }
        };

        this.commandEntry.addEventListener('keydown',this.commandEntryKeyDownCallback);

        this.isolation = false;

    };

    /**
     * Disable command row, remove event listener and content editable
     *
     * @returns {CommandRow}
     */
    CommandRow.prototype.disable = function(){
        this.commandEntry.contentEditable = false;
        Utils.removeClass(this.commandRow,'active');
        this.commandEntry.removeEventListener('keydown',this.commandEntryKeyDownCallback);
        return this;
    };

    /**
     * Hide user name
     *
     * @returns {CommandRow}
     */
    CommandRow.prototype.hideUser = function(){
        this.commandUser.parentNode.removeChild(this.commandUser);
        return this;
    };

    /**
     * Hide time
     *
     * @returns {CommandRow}
     */
    CommandRow.prototype.hideTime = function(){
        this.commandTime.parentNode.removeChild(this.commandTime);
        return this;
    };
    /**
     * Add content to the editable entry
     *
     * @param message
     * @returns {CommandRow}
     */
    CommandRow.prototype.setEntry = function(message){
        this.commandEntry.innerHTML = message;
        Utils.placeCaretAtEnd(this.commandEntry);
        return this;
    };

    /**
     * Add content to the protected entry
     *
     * @param message
     * @returns {CommandRow}
     */
    CommandRow.prototype.setProtectedEntry = function(message){
        this.commandEntryProtected.innerHTML = message;
        return this;
    };

    /**
     * Put this command row in isolation mode
     * Isolation mode will protected the command row from command line events.
     *
     * @param flag
     * @returns {boolean}
     */
    CommandRow.prototype.isolate = function(flag){
        this.isolation = flag;
        return false;
    };

    /**
     * Check if this command row is in isolated mode
     *
     * @returns {boolean}
     */
    CommandRow.prototype.isIsolated = function(){
        return this.isolation === true;
    };

    /**
     * Get Entry value
     *
     * @returns {string}
     */
    CommandRow.prototype.getEntry = function(){
        return this.commandEntry.textContent;
    };
})();
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
var CommandLine;

(function(){

    "use strict";

    /**
     *
     * @param container
     * @constructor
     */
    CommandLine = function(container){
        this.container = container;
        this.commands = [];
        this.history = [];
        this.currentHistoryIndex = 0;
        this.setUsername("Solaiman");

        var $self = this;
        this.container.addEventListener('keydown',function(e){
            if($self.commandRow && $self.commandRow.isIsolated() === false){
                /**
                 * Commands history cursor
                 */
                if((e.keyCode == 38 || e.keyCode == 40)){
                    e.preventDefault();
                    if(e.keyCode == 38){
                        // up .. previous
                        if($self.currentHistoryIndex >= 0){
                            $self.currentHistoryIndex--;
                        }
                    }else if(e.keyCode == 40){
                        if($self.currentHistoryIndex < $self.history.length){
                            $self.currentHistoryIndex++;
                        }
                    }
                    if(typeof  $self.history[$self.currentHistoryIndex] != "undefined"){
                        $self.commandRow.setEntry($self.history[$self.currentHistoryIndex]);
                    }else{
                        $self.commandRow.setEntry('');
                    }
                }else if(e.keyCode == 9){
                    e.preventDefault();
                    var results = [];
                    var userCommand = $self.commandRow.getEntry();
                    if(userCommand === ''){
                        return;
                    }
                    for(var command = 0 ;command < $self.commands.length;command++){
                        if(Utils.startsWith($self.commands[command].resolved.getCommand(),userCommand)){
                            results.push($self.commands[command]);
                        }
                    }
                    if(results.length == 1){
                        $self.commandRow.setEntry(results[0].resolved.getCommand());
                    }else if(results.length > 1){
                        var autocompletionResults = [];
                        for(var resultIndex = 0 ; resultIndex < results.length;resultIndex++){
                            autocompletionResults.push(results[resultIndex].resolved.getSignature());
                            autocompletionResults.push(results[resultIndex].description);
                        }
                        $self.list(autocompletionResults,2);
                        $self.startNewCommand();
                        $self.commandRow.setEntry(userCommand);
                    }
                }
            }
        });

        /**
         * Ctrl + c to Stop Execution &  Ctrl + r to Clear Buffer
         *
         * @type {boolean}
         */
        var ctrlDown = false,
            ctrlKey = 17,
            cKey = 67,
            rKey = 82;

        this.container.addEventListener('keydown',function(e){
            if (e.keyCode == ctrlKey){
                ctrlDown = true;
            }
        });

        this.container.addEventListener('keyup',function(e){
            if (e.keyCode == ctrlKey){
                ctrlDown = false;
            }
        });

        this.container.addEventListener('keydown',function(e){
            if (ctrlDown && e.keyCode == cKey){
                $self.stop();
            }else if (ctrlDown && e.keyCode == rKey){
                e.preventDefault();
                $self.container.innerHTML = '';
                $self.stop();
            }
        });

        this.container.addEventListener('click',function(){
            if($self.commandRow){
                $self.commandRow.commandEntry.focus();
            }
        });

    };


    /**
     * Print new command line input
     */
    CommandLine.prototype.startNewCommand = function(){

        var $self = this;

        if(this.commandRow){
            this.commandRow.disable();
        }

        this.commandRow = new CommandRow(this,function(value){
            if(/\S/.test(value)){
                $self.run(value);
            }else{
                $self.stop();
            }
        });

    };

    /**
     * register new command
     *
     * @param command
     * @param callback
     */
    CommandLine.prototype.addCommand = function(command, callback, description){
        if(typeof description === 'undefined'){
            description = '';
        }
        this.commands.push({
            name:command,
            callback:callback,
            description:description,
            resolved: new CommandResolver(command)
        });
    };

    /**
     * Run a given command
     *
     * @param command
     */
    CommandLine.prototype.run = function(command)
    {
        try{
            this.history.push(command);
            this.currentHistoryIndex = this.history.length;
            this.find(command);
        }catch(err){
            if(err instanceof Array){
                for(var messageIndex = 0 ; messageIndex < err.length;messageIndex++){
                    this.error(err[messageIndex]);
                }
            }else{
                this.error(err);
            }
            this.stop();
        }
    };

    /**
     * Find the registered command object by given command text
     * 
     * @param command
     */
    CommandLine.prototype.find = function(command){

        var parsedCommand = new CommandParser(command);
        var resolvedCommand;

        for(var i = 0 ; i < this.commands.length;i++){
            if(this.commands[i].resolved.getCommand() === parsedCommand.getCommand()){
                resolvedCommand = this.commands[i].resolved;
                resolvedCommand.dispatch(parsedCommand);
                var result = this.commands[i].callback.apply(this,[parsedCommand]);
                if(result !== false){
                    this.stop();
                }
                return;
            }
        }

        throw "<b>[" + parsedCommand.getCommand() + "]</b> Command Not found";
    };


    /**
     * Output Error message
     * 
     * @param message
     */
    CommandLine.prototype.error = function (message) {
        this.output(message);
        Utils.addClass(this.commandRow.commandRow,'error');
    };

    /**
     * Output Success message
     *
     * @param message
     */
    CommandLine.prototype.success = function(message){
        this.output(message);
        Utils.addClass(this.commandRow.commandRow,'success');
    };

    /**
     * Output Information message
     *
     * @param message
     */
    CommandLine.prototype.info = function(message){
        this.output(message);
        Utils.addClass(this.commandRow.commandRow,'info');
    };

    /**
     * Output Warning message
     *
     * @param message
     */
    CommandLine.prototype.warning = function(message){
        this.output(message);
        Utils.addClass(this.commandRow.commandRow,'warning');
    };

    /**
     * Output non-styled message
     *
     * @param message
     */
    CommandLine.prototype.output = function(message){
        this.stop();
        this.commandRow.hideUser();
        this.commandRow.setEntry(message);
        this.commandRow.disable();
    };

    /**
     * Receive user input
     *
     * @param title
     * @param confirmCallback
     */
    CommandLine.prototype.prompt = function(title,confirmCallback){
        new CommandPrompt(this,title,confirmCallback);
    };

    /**
     * Receive user input
     *
     * @param title
     * @param confirmCallback
     */
    CommandLine.prototype.secret = function(title,confirmCallback){
        new CommandSecret(this,title,confirmCallback);
    };

    /**
     * Ask user for confirmation by Y or N , y or n
     *
     * @param title
     * @param confirmCallback
     */
    CommandLine.prototype.confirm = function(title,confirmCallback){
        var $self = this;
        title+='[Y/N]';
        var confirm = function(){
            $self.commandRow = new CommandRow($self,function(value){
                value = value.toLowerCase();
                if(value !== 'n' && value !== 'y'){
                    $self.commandRow.disable();
                    confirm();
                }else{
                    confirmCallback(value === 'y');
                }
            });
            $self.commandRow.isolate(true);
            $self.commandRow.hideUser();
            $self.commandRow.setProtectedEntry(title);
        };
        confirm();
    };

    /**
     * Output data listing
     *
     * @param data
     * @param cellsPerRow
     */
    CommandLine.prototype.list = function(data,cellsPerRow){
        if(typeof cellsPerRow == 'undefined'){
            cellsPerRow = 4;
        }
        var arrayChunk = function(array,chunk){
            var i,j;
            var chunks = [];
            for (i=0, j=array.length; i<j; i+=chunk) {
                chunks.push(array.slice(i,i+chunk));
            }
            return chunks;
        };

        var output = '<table style="width:100%">';
        var dataChuncks = arrayChunk(data,cellsPerRow);
        for(var row = 0; row < dataChuncks.length;row++){
            output+='<tr>';
            for(var cell = 0 ; cell < dataChuncks[row].length;cell++ ){
                output+='<td style="width:25%;vertical-align: top">' + dataChuncks[row][cell] + '</td>';
            }
            output+='</tr>';
        }
        output+='</table>';
        this.output(output);
        this.commandRow.hideTime();
        Utils.addClass(this.commandRow.commandEntry,'block');
    };

    /**
     * Stop current execution and start a new command
     */
    CommandLine.prototype.stop = function(){
        if(this.commandRow){
            this.commandRow.disable();
        }
        this.startNewCommand();
    };

    /**
     * Set Command line username
     *
     * @param username
     * @returns {CommandLine}
     */
    CommandLine.prototype.setUsername = function(username){
        this.username = username;
        return this;
    };

})();