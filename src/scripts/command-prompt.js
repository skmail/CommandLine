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