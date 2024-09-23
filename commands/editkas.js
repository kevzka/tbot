const postData = require('../database/postdata.js');

module.exports = {
    name: 'editkas',
    execute: async ({sock, msg, msgtext}) => {
        const sender = msg.key.remoteJid;
        const split = msgtext.split(' ');
        if (split[1] == undefined && split[2] == undefined) {
            await sock.sendMessage(sender, { text: `masukan nama dan nominal\ncontoh: fulan 11000` }, {quoted: msg});
        } else {
            if(isNaN(split[2])){
                await sock.sendMessage(sender, { text: `nominal harus angka` }, {quoted: msg});
            } else {
                const named = split[1];
                const nominald = split[2];
                const {name, nominal} = await postData({name: named, nominal: nominald});
                const teks = `kas ${name}: ${nominal} telah di ubah`
                await sock.sendMessage(sender, { text: teks }, {quoted: msg});
            }
        }
    }
};
