const fetchdata = require("../database/getdata");
module.exports = {
	name: "kaskelas",
	execute: async ({ sock, msg }) => {
		const kasmurid = await fetchdata();
		const sender = msg.key.remoteJid;
		let formatter = Intl.NumberFormat("en", { notation: "compact" });
		let number = Number("-15000");
		let bignumber = number.toExponential();
		let numberformat = formatter.format(bignumber);
		console.log(`${number} ${bignumber} ${numberformat}`);
		let str = "";
		let str2 = "";
		kasmurid.forEach((data) => {
			const angka = formatter.format(Number(data.nominal).toExponential());
			str2 = `${data.id}.${data.nama}: `;
			if (data.bayar == "false") {
				str2 += `${angka}`;
			} else if (data.bayar == "true") {
				let nominal = data.nominal != "0" ? angka : "";
				str2 += `*LUNAS* ${nominal}`;
			} else {
				str2 += `error reading\n`;
			}
			if (data.bayar == "false") {
				str += `${str2.padEnd(21, "-")}❌\n`;
			} else if (data.bayar == "true") {
				str += `${str2.padEnd(21, "-")}✅\n`;
			}
		});
		await sock.sendMessage(sender, { text: str }, { quoted: msg });
	},
};
