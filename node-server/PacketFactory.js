exports.PacketFactory = {
    buildJRES: () => {
        const buff = Buffer.alloc(4);
        buff.write("JRES");
        return buff;
    },
    buildQUIT: () => {
        const buff = Buffer.alloc(4);
        buff.write("QUIT");
        return buff;
    }
    // buildEVNT: (response) => { //1 = yes 0 = no
    //     const packetLength = 4 + response.length;
    //     const buff = Buffer.alloc(packetLength);
    //     buff.write("EVNT");
    //     buff.write(response, 4);
    //     return buff;
    // }
}