module.exports = {
    name: 'tagall',
    execute: async (sock, msg) => {
        const sender = msg.key.remoteJid;
        const groupId = sender; // This should be your group ID

            try {
                // Fetch group metadata including members
                const groupMetadata = await sock.groupMetadata(groupId);
                const participants = groupMetadata.participants;
                
                // Log member details
                console.log(groupMetadata);
                console.log(`Members of group ${groupId}:`);
                participants.forEach(participant => {
                    console.log(`ID: ${participant.id}, Name: ${participant.notify || 'No Name'}`);
                });
                
                // Optional: Send list of members as a message in the group
                const memberList = participants.map(participant => `ID: ${participant.id}, Name: ${participant.notify || 'No Name'}`).join('\n');
                await sock.sendMessage(groupId, { text: `List of members:\n${memberList}` });
                
            } catch (error) {
                console.error('Error fetching group members:', error);
            }
        await sock.sendMessage(sender, { text: groupMetadata }, {quoted: msg});
    }
};
