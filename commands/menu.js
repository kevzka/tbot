module.exports = {
    name: 'menu',
    execute: async ({sock, commands, msg}) => {
        const sender = msg.key.remoteJid;
        let teks = ``;
        teks += `jam ${global.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}\n`
        for(let command in commands){
            teks += `-> ${global.prefix}${command}\n`;
        }
        await sock.sendMessage(sender, { text: teks }, {quoted: msg});
    }
};
