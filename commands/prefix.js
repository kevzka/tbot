// require('../index')
module.exports = {
    name: 'setprefix',
    owner: true,
    execute: async ({sock, msg, msgText}) => {
        const sender = msg.key.remoteJid;
        const part = msgText.split(' ');
        if(part[1] == undefined){
            await sock.sendMessage(sender, { text: `masukan prefix nya kocak!!`}, { quoted: msg });
        } else {
            global.prefix = part[1];
            await sock.sendMessage(sender, { text: global.prefix }, {quoted: msg});
        }
    }
};
