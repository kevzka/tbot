// require('../index')
module.exports = {
    name: 'test',
    owner: true,
    execute: async ({sock, msg, msgtext}) => {
        /* const sender = msg.key.remoteJid;
        const part = msgtext.split(' ');
        if(part[1] == undefined){
            await sock.sendMessage(sender, { text: `masukan jam`}, { quoted: msg });
        } else {
            global.piketHour = part[1];
            await sock.sendMessage(sender, { text: global.piketHour }, {quoted: msg});
        } */
       
    }
};