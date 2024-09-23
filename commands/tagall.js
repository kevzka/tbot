module.exports = {
  name: "TagAll",
  onlyGroup: true,
  execute: async ({sock, msg, msgtext}) => {
    const sender = msg.key.remoteJid;
    const groupId = sender; // This should be your group ID
    try {
      const groupMetadata = await sock.groupMetadata(groupId);
      const participants = groupMetadata.participants;
      let member = [];
      participants.forEach((participant) => {
        member.push(participant.id);
      });
      console.log(`debug msgtext ` + msgtext);
      msgtext = (msgtext.split(" ").slice(1).join(" ") != "") ? msgtext.split(" ").slice(1).join(" ") : '@everyone'
      console.log(`debug msgtext ` + msgtext);
      await sock.sendMessage(sender, { text: msgtext, mentions: member });
    } catch (error) {}
  },
};
