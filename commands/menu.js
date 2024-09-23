module.exports = {
	name: "menu",
	execute: async ({ sock, commands, msg }) => {
		const sender = msg.key.remoteJid;
		let concatall = ``;
		let concatrow = {};
		concatall += `jam ${global.time.toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})}\n`;
		function toconcatall(concatrow) {
			delete concatrow.execute;
			concatall = "";
			for (let properti in concatrow) {
				concatall += concatrow[properti];
			}
			return concatall;
		}
		function checkincludevalue(include) {
			for (let properti in concatrow) {
				if (properti != "name") {
					if (concatrow[properti].includes(include)) {
						concatrow["name"] = concatrow["name"].replace(
							`-> ${global.prefix}${include} \n`,
							""
						);
					}
				}
			}
		}
		for (let command in commands) {
			let totalLength = 18;
			for (let properti in commands[command]) {
				let key = properti != "name" && properti != "execute" ? properti : "name";
				let properties = key == "name" ? "no-category" : `${properti}`;
				let teks = properties != "" ? `<[${properties}]>` : ``;
				let paddingLength = totalLength - teks.length;
				let padStartLength = Math.floor(paddingLength / 2);
				teks =
					teks
						.padStart(teks.length + padStartLength, "━")
						.padEnd(totalLength, "━") + `\n`;
				teks = properties !=  "no-category" ? `┣━${teks}` : `┏━${teks}`;
		
				if (!concatrow[key]) {
					concatrow[key] = "";
				}
				if (!concatrow[properti]) {
					concatrow[properti] += "";
				}
				if (!concatrow[properti].includes(teks)) {
					concatrow[properti] += teks;
				}
				let entry = `┠> ${global.prefix}${command}\n`;
				concatrow[properti] += entry;
				checkincludevalue(command);
			}
			toconcatall(concatrow);
			let test = '━'
			concatall += `┗`+ test.repeat(totalLength + 1);
		}
		console.log(concatrow);

		await sock.sendMessage(sender, { text: concatall }, { quoted: msg });
	},
};
