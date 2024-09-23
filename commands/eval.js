module.exports = {
    name: 'eval',
    owner: true,
    execute: async ({sock, msg, msgtext}) => {
        const sender = msg.key.remoteJid;
        msgtext = msgtext.split(" ").slice(1).join(" ");
        eval(msgtext);
    }
};
