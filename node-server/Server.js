const Session = new require('./Session.js').Session;
const PacketFactory = new require('./PacketFactory.js').PacketFactory;
var os = require("os");

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

const version = "0.8.0";

exports.Server = class Server {

	constructor(args) {

	this.args = args;

	console.log("Starting server...");
	console.log("version: " + version);
	
    this.session = new Session(this);

	this.sock = require('dgram').createSocket({type: 'udp4', reuseAddr: true});
	this.sock.on('message',(msg,rinfo)=>{this.onPacket(msg,rinfo);});
	this.sock.on('error', (e)=>{ this.onError(e); });
    this.sock.on('close', (e)=>{ this.onDisconnect(e); });
	this.sock.bind(this.args.port,()=>{
		this.sock.setBroadcast(true);
		console.log();
		console.log("Server is listening on " + addresses[0] + ":" + this.args.port);
		console.log();
		this.loop();
		});
	}
	loop(){
		setTimeout(()=>{ this.loop(); }, 1000);
	}
	onError(e){
		console.log(e);
	}
    onDisconnect(e){
        console.log(e);
    }
	onPacket(packet,rinfo){
		//console.log("packet from " + rinfo.address +":"+rinfo.port+" : "+ packet);
		if(packet.length < 4) return;//not enough data, invalid packet.
		const packetType = packet.slice(0,4).toString();

		if (this.args.debugPackets) {
			console.log("Recieved Packet Type: '" + packetType + "' from " + rinfo.address + ":" + rinfo.port);
		}

		switch(packetType){
			case "JOIN": {
				// Only add device to session if it doesn't already exist.
				let device = this.session.lookupDevice(rinfo);
				if (device === undefined) {
					this.session.addDevice(rinfo);
				}

                let buff = PacketFactory.buildJRES();
                this.sock.send(buff, 0, buff.length, rinfo.port, rinfo.address);
                break;
			}
			case "EVNT": {
                this.session.broadcast(packet); //send packet to session, to send to all devices
				break;
			}
			case "UDAT": {
				// Update session data.
				let udatJson = packet.slice(4, packet.length);
				let udatObj = JSON.parse(udatJson);
				let senderIpSplit = udatObj.senderIp.split(":");
				let senderAddress = senderIpSplit[0];
				let senderPort = senderIpSplit[1];
				let senderDevice = this.session.lookupDeviceByIp(senderAddress, senderPort);

				if (senderDevice) {
					this.session.updateSessionData(udatObj); // store session data on this server.
					this.session.broadcastExcept(packet, senderDevice); //send packet to session, to send to all devices except the sender's.
				} else {
					if (this.args.debugPackets) {
						console.warn("Ignoring session data update event for device " + rinfo.address + ":" + rinfo.port + " that is not connected to the session.");
					}
				}
				break;
			}
			case "RDAT": {
				// Request for all session data.
				let returnPacket = "GDAT" + JSON.stringify(this.session.sessionData);
				this.sock.send(returnPacket, 0, returnPacket.length, rinfo.port, rinfo.address);
				break;
			}
            case "KEEP": {
				//keep device alive
				let device = this.session.lookupDevice(rinfo);
				if (device) {
					device.keepAlive();
				} else {
					if (this.debugDevices) {
						console.warn("Ignoring keep alive event for device " + rinfo.address + ":" + rinfo.port + " that is not connected to the session.");
					}
				}
                break;
			}
			case "QUIT": {
				this.session.onDisconnect(this.session.lookupDevice(rinfo));
				break;
			}
		}
	}
	
	onSessionQuit(){
        let buff = PacketFactory.buildQUIT();
        this.session.broadcast(buff);

        //TODO Disconnect clients

        this.session = new Session(this);
	}
}