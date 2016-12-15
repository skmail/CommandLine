var DemoCommand ;

(function(){

    "use strict";

    DemoCommand = {};

    DemoCommand.instance = function(selector){

        var cmd = new CommandLine(selector);

        /**
         * Set command line username  by command argument
         */
        cmd.addCommand("update-user username",function(command){
            cmd.setUsername(command.getArgument('username'));
        },"Set username  by command argument");


        /**
         * Set command line username from prompt
         */
        cmd.addCommand("prompt",function(){
            this.prompt("type your name",function(userInput){
                if(userInput === ''){
                    cmd.error("Your name cannot be empty!");
                    this.start();
                }else{
                    cmd.setUsername(userInput);
                    cmd.startNewCommand();
                }
            });
            return false;
        },'Set username from prompt ');


        /**
         * Confirmation to remove all file ;)
         */
        cmd.addCommand("rm",function(){
            this.confirm("Are yous sure to delete all files?",function(yes){
                if(yes){
                    cmd.error("Permission denied!!");
                }else{
                    cmd.success("Great :)");
                }
                cmd.startNewCommand();
            });
            return false;
        },'Remove all files.');


        /**
         * Login :)
         */
        cmd.addCommand("login",function(){
            this.prompt("Enter your username [any name]: ",function(username){
                cmd.secret("Enter your password [Type 123]",function(password){
                    if(password !== '123'){
                        cmd.error('Wrong password');
                        this.start();
                    }else{
                        setTimeout(function(){
                            cmd.info('Authenticating ...');
                            setTimeout(function(){
                                cmd.info('Loading Application ...');
                                setTimeout(function(){
                                    cmd.warning('I am not saving this password! Don\'t worry :)');
                                    setTimeout(function(){
                                        cmd.success('System Ready to use...');
                                        cmd.setUsername(username);
                                        cmd.startNewCommand();
                                    },800);
                                },800);
                            },800);


                        },800);
                    }
                });
            });
            return false;
        },'Login by username & password');


        /**
         * Help :)
         */
        cmd.addCommand("help",function(){
            var helpResults = [];
            for(var command = 0;command < this.commands.length;command++){
                helpResults.push(this.commands[command].resolved.getSignature());
                helpResults.push(this.commands[command].description);
            }
            this.list(helpResults,2);
        },"Show available commands");



        /**
         * List all files
         */
        cmd.addCommand("ls",function(){
            this.list([
                'Applications',
                'User Information',
                'Library',
                'Users',
                'Volumes',
                'etc',
                'Users',
                'home',
                'var',
                'System'
            ]);
        },'List directory files');


        /**
         * List all files
         */
        cmd.addCommand("date",function(){
            this.output(new Date());
            this.commandRow.hideTime();
        },'show current DateTime');


        /**
         * Show current user
         */
        cmd.addCommand("whoami",function(){
            this.output(this.username);
            this.commandRow.hideTime();
        },'show current Username');


        /**
         * Show current user
         */
        cmd.addCommand("shortcuts",function(){
            this.list([
                'Ctrl + c :  Cancel Command',
                'Ctrl + r :  Clear Screen',
                'Arrow up :  Previous command',
                'Arrow Down :  Next Command',
                'Tab :  Autocomplete command'
            ],1);
        },'Show keyboard short cuts');

        return cmd;
    };

})();