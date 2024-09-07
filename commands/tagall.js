module.exports = {
  name: "tagall",
  execute: async (sock, msg) => {
    const sender = msg.key.remoteJid;
    const groupId = sender; // This should be your group ID
    try {
      const groupMetadata = await sock.groupMetadata(groupId);
      const participants = groupMetadata.participants;
      let member = [];
      console.log(groupMetadata);
      participants.forEach((participant) => {
        member.push(participant.id);
      });
      console.log(member);
      await sock.sendMessage(sender, { text: 'test', mentions: member });
    } catch (error) {}
  },
};