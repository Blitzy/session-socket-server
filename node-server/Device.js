
const TIMEOUT = 1000 * 10; //60000 one minute. 3600000 one hour

exports.Device = class Device {
	constructor(rinfo, game){
		this.rinfo = rinfo;
		this.game = game;

		this.connectionTimeout = this.game.timeNow + TIMEOUT;
	}
	matches(rinfo){
		if(this.rinfo.address != rinfo.address) return false;
		if(this.rinfo.port != rinfo.port) return false;
		return true;
	}
	matchesIp(address, port){
		if(this.rinfo.address != address) return false;
		if(this.rinfo.port != port) return false;
		return true;
	}
	isTimedOut(){
		let timedOut = this.connectionTimeout < this.game.timeNow;
		// console.log("checking if timed out: " + this.connectionTimeout + " < " + this.game.timeNow + " == " + timedOut);
		return timedOut;
	}
	keepAlive(){
		this.connectionTimeout = this.game.timeNow + TIMEOUT;
	}
	toString(){
		return this.rinfo.address + ":" + this.rinfo.port;
	}
}