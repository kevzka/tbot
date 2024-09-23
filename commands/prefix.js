// require('../index')
module.exports = {
    name: 'setprefix',
    owner: true,
    execute: async ({sock, msg, msgtext}) => {
        const sender = msg.key.remoteJid;
        console.log(sender);
        const part = msgtext.split(' ');
        if(part[1] == undefined){
            await sock.sendMessage(sender, { text: `masukan prefix nya kocak!!`}, { quoted: msg });
        } else {
            global.prefix = part[1];
            await sock.sendMessage(sender, { text: global.prefix }, {quoted: msg});
        }
    }
};
