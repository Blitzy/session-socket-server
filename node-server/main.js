const Args = require('./Args.js').Args;
const Server = require('./Server.js').Server;

var args = new Args();
new Server(args);