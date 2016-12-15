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