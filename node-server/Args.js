// require('console.table');

exports.Args = class Args {

    constructor() {
        this.initDefaults();
        this.parseArgs();
    }

    initDefaults() {
        this.port = 5556;
        this.debugPackets = false;
        this.debugDevices = false;
        this.debugSessionData = false;
    }

    parseArgs() {
        if (process.argv.length <= 2) {
            return;
        }

        console.log();
        console.log("=======================");
        console.log("= Argument Processing =");
        console.log("=======================");

        for(let i = 2; i < process.argv.length; i++) {
            let rawArg = process.argv[i];
            let split = rawArg.split("=", 2);
            if (split && split.length == 2) {
                this.processArg(split[0], split[1]);
            } else {
                this.processArg(rawArg, null);
            }
        }
        
        console.log();
    }

    processArg(key, value) {
        key = key.toLowerCase();
        switch(key) {
            case "port": {
                let integer = Number.parseInt(value);
                if (integer) {
                    this.port = integer;
                    this.logArg(`Port set to ${this.port}`);
                } else {
                    this.logArgError(`'${key}' value needs to be an integer.`);
                }
                return;
            }
            case "debugpackets" : {
                let enabled = parseBoolean(value);
                this.debugPackets = enabled;
                if (enabled) {
                    this.logArg(`Packet debugging is enabled.`);
                } else {
                    this.logArg(`Packet debugging is disabled.`);
                }
                return;
            }
            case "debugdevices" : {
                let enabled = parseBoolean(value);
                this.debugDevices = enabled;
                if (enabled) {
                    this.logArg(`Device debugging is enabled.`);
                } else {
                    this.logArg(`Device debugging is disabled.`);
                }
                return;
            }
            case "debugsessiondata" : {
                let enabled = parseBoolean(value);
                this.debugSessionData = enabled;
                if (enabled) {
                    this.logArg(`Session data debugging is enabled.`);
                } else {
                    this.logArg(`Session data debugging is disabled.`);
                }
                return;
            }
            default: {
                this.logArgWarning(`'${key}' is not a supported argument.`);
            }
        }
    }

    logArg(msg) {
        console.log(`  > ${msg}`);
    }

    logArgWarning(msg) {
        console.warn(`  > WARNING: ${msg}`);
    }

    logArgError(msg) {
        console.error(`  > ERROR: ${msg}`);
    }
}

exports.PrintHelp = function() {
    let argHeader = "Arg"
    let descHeader = "Description";

    console.log();
    console.log("=================");
    console.log("= Argument Help =");
    console.log("=================");
    console.log("  > port");
    console.log("      The port that the server will communicate on.");
    console.log("      example: port=1234");
    console.log();
    console.log("  > debugpackets");
    console.log("     Wether or not the server should print packet information to the console.");
    console.log("     example: debugpackets=1 | debugpackets=true");
    console.log();
    console.log("  > debugdevices");
    console.log("      Wether or not the server should print connected device information to the console.");
    console.log("      example: debugdevices=1 | debugdevices=true");
    console.log();
    console.log("  > debugsessiondata");
    console.log("      Wether or not the server should print raw session data to the console.");
    console.log("      example: debugsessiondata=1 | debugsessiondata=true");
    console.log();
}

parseBoolean = function(string) {
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return false;
    }
}
