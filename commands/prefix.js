// require('../index')
module.exports = {
    name: 'setprefix',
    owner: true,
    execute: async (sock, msg, msgText) => {
        const sender = msg.key.remoteJid;
        const part = msgText.split(' ');
        global.prefix = part[1];
        await sock.sendMessage(sender, { text: global.prefix }, {quoted: msg});
    }
};
