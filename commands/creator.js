module.exports = {
	name: "creator",
	execute: async ({ sock, msg }) => {
        const sender = msg.key.remoteJid;
		const vcard =
			"BEGIN:VCARD\n" + // metadata of the contact card
			"VERSION:3.0\n" +
			"FN:Kepin\n" + // full name
			"ORG:apta;\n" + // the organization of the contact
			"TEL;type=CELL;type=VOICE;waid=6283116752250:+62 83116 752250\n" + // WhatsApp ID + phone number
			"END:VCARD";
		const sentMsg = await sock.sendMessage(sender, {
			contacts: {
				displayName: "kevin",
				contacts: [{ vcard }],
			},
		});
	},
};
