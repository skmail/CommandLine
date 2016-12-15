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