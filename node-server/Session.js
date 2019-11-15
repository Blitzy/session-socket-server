const Device = new require('./Device.js').Device;
const PacketFactory = new require('./PacketFactory.js').PacketFactory;

exports.Session = class Session {

	constructor(server) {
		this.timeNow = Date.now();
		this.server = server;
		this.devices = [];
		this.sessionDone = false;
		this.sessionData = {};

		console.log("New session beginning...");
		this.play();
	}

	addDevice(rinfo) {
		console.log("adding device: " + rinfo.address + ":" + rinfo.port);

		const device = new Device(rinfo, this);
		this.devices.push(device);
		
		if (this.server.args.debugDevices) {
			console.log("list of devices: ");
			console.group();
			this.devices.forEach((device) => {
				console.log(device.toString());
			});
			console.groupEnd();
		}
	}

	play() {
		this.mainLoop();
	}

	stop() {
		if(this.timer) clearTimeout(this.timer);
		this.timer = null;
		this.sessionDone = true;
	}

	mainLoop() {
		if(this.sessionDone) return;
    	this.timeNow = Date.now();
		this.tickDevices();
		this.timer = setTimeout(() => this.mainLoop(), 50);
	}

	tickDevices() {
		this.devices.forEach((device) => {
			if(device.isTimedOut()){
				console.log(device.toString() + " has timed out");
				// Disconnect client device from this server.
				this.onDisconnect(device);
			}
		});
	}

	lookupDevice(rinfo) {
		let result = this.devices.find((device) => {
			return device.matches(rinfo);
		});
		return result;
	}

	lookupDeviceByIp(address, port) {
		let result = this.devices.find((device) => {
			return device.matchesIp(address, port);
		});
		return result;
	}

	onDisconnect(device) {
    	console.log(device.toString() + " has disconnected");
		this.devices.splice(this.devices.indexOf(device), 1);
	}

	broadcast(packet) {
		if (this.server.args.debugPackets) {
			console.log("broadcasting packet to all -> " + packet.toString());
		}
		//send to everyone
		for (var i = 0; i < this.devices.length; i++)
		{
			let device = this.devices[i];
			if (this.server.args.debugPackets) {
				console.log("sending packet to: " + device.toString());
			}
			this.server.sock.send(packet, 0, packet.length, device.rinfo.port, device.rinfo.address);
		}
	}

	broadcastExcept(packet, ignoreDevice) {
		if (this.server.args.debugPackets) {
			console.log("broadcasting packet to all except " + ignoreDevice.toString() + " -> " + packet.toString());
		}
		// send to everyone except the specified device to ignore.
		for (var i = 0; i < this.devices.length; i++)
		{
			let device = this.devices[i];
			if (device === ignoreDevice)
			{
				if (this.server.args.debugPackets) {
					console.log(i + " skipping " + ignoreDevice.toString() + " for packet broadcast.");
				}
				continue;
			}

			if (this.server.args.debugPackets) {
				console.log(i + " sending packet to: " + device.toString());
			}
			this.server.sock.send(packet, 0, packet.length, device.rinfo.port, device.rinfo.address);
		}
	}

	updateSessionData(udatObj) {
		let id = udatObj.sessionDataId;
		let json = udatObj.sessionDataJson;
		if (this.server.args.debugSessionData) {
			console.log("Update session data\n  id: " + id + "\n  json: " + json);
		}
		this.sessionData[id] = json;
	}
}