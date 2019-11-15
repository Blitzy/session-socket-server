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

parseBoolean = function(string) {
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return false;
    }
}
