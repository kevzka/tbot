module.exports = {
    name: 'eval',
    owner: true,
    execute: async ({sock, msg, msgText}) => {
        const sender = msg.key.remoteJid;
        msgText = msgText.split(" ").slice(1).join(" ");
        eval(msgText);
    }
};
