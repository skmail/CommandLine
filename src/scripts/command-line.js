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