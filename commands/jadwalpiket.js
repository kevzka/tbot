const fs = require("fs");
module.exports = {
	name: "piket",
	execute: async ({ sock, msg, msgtext, thumbnail }) => {
		const piket = {
			senin: "./media/image/senin-selasa.jpg",
			selasa: "./media/image/senin-selasa.jpg",
			rabu: "./media/image/rabu-kamis.jpg",
			kamis: "./media/image/rabu-kamis.jpg",
			jumat: "./media/image/jumat.jpg",
		};
		const date = global.time;
		const hari = [
			"minggu",
			"senin",
			"selasa",
			"rabu",
			"kamis",
			"jumat",
			"sabtu",
		];
		const sender = msg.key.remoteJid;
		console.log(date.getDay());
		if (date.getDay() != 6 && date.getDay() != 0) {
			const imagePath = piket[hari[date.getDay()]];
			console.log(`hari[date.getDay()]: ${hari[date.getDay()]}`);
			console.log(`piket[hari[date.getDay()]]: ${imagePath}`);

			if (imagePath) {
				const send = {
					image: fs.readFileSync(imagePath),
					caption: `piket hari ${hari[date.getDay()]}`,
					jpegThumbnail: thumbnail(imagePath),
				};

				try {
					await sock.sendMessage(sender, send, { quoted: msg });
				} catch (err) {
					console.log(`jadwal piket error ${err}`);
				}
			} else {
				console.log("Piket path tidak ada untuk hari ini");
			}
		} else {
			console.log("ini hari minggu atau sabtu"); //jamgam di ubah dape yang console" soale untuk debugging nanti
			const teks = "masukan sendiri dape teks nya"; //masukan sendiri dape teks nya
			await sock.sendMessage(sender, {text: teks}, { quoted: msg });
		}
	},
};
