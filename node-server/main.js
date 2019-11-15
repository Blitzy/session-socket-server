const Args = require('./Args.js').Args;
const ArgsHelp = require('./Args.js').PrintHelp;
const Server = require('./Server.js').Server;

if (process.argv.length === 3 && process.argv[2].toLowerCase() === 'help') {
    // Help arguement detected.
    ArgsHelp();
} else {
    console.log();
    console.log("TIP: You can use the 'help' argument if you want to see a list of supported arguements for the server.");
    console.log();
    var args = new Args();
    new Server(args);
}
