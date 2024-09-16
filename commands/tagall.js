module.exports = {
  name: "tagall",
  onlyGroup: true,
  execute: async ({sock, msg, msgText}) => {
    const sender = msg.key.remoteJid;
    const groupId = sender; // This should be your group ID
    try {
      const groupMetadata = await sock.groupMetadata(groupId);
      const participants = groupMetadata.participants;
      let member = [];
      participants.forEach((participant) => {
        member.push(participant.id);
      });
      console.log(`debug msgText ` + msgText);
      msgText = (msgText.split(" ").slice(1).join(" ") != "") ? msgText.split(" ").slice(1).join(" ") : '@everyone'
      console.log(`debug msgText ` + msgText);
      await sock.sendMessage(sender, { text: msgText, mentions: member });
    } catch (error) {}
  },
};