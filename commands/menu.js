module.exports = {
    name: 'menu',
    execute: async ({sock, commands, msg}) => {
        const sender = msg.key.remoteJid;
        let teks = ``;
        for(let command in commands){
            teks += `-> ${global.prefix}${command}\n`;
        }
        await sock.sendMessage(sender, { text: teks }, {quoted: msg});
    }
};
