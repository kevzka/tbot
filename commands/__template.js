
module.exports = {
    name: 'hai',
    execute: async (sock, msg) => {
        const sender = msg.key.remoteJid;
        await sock.sendMessage(sender, { text: `hai` }, {quoted: msg});
    }
};
