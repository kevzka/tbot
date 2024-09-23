module.exports = {
	name: "menu",
	execute: async ({ sock, commands, msg }) => {
		const sender = msg.key.remoteJid;
		let teks = ``;
		let teks2 = {};
		teks += `jam ${global.time.toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})}\n`;
		for (let command in commands) {
			for (let properti in commands[command]) {
				let key =
					properti != "name" && properti != "execute" ? properti : "name";
				let properties = key === "name" ? "" : `(${properti})`;

				if (!teks2[key]) {
					teks2[key] = "";
				}

				let entry = `-> ${global.prefix}${command} ${properties}\n`;
				if (!teks2[key].includes(entry)) {
					teks2[key] += entry;
				}
			}
		}

		for (let properti in teks2) {
			teks += teks2[properti];
		}

		console.log(teks2);
		await sock.sendMessage(sender, { text: teks }, { quoted: msg });
	},
};
