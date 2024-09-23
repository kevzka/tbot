async function dailyPiket({sock}) {
	const sender = '6283116752250@s.whatsapp.net';
	setInterval(() => {
		let hour = global.time.toLocaleTimeString("id-ID");
		// console.log(`ini sudah belum jam: ` + global.piketHour + '=>' + hour);
		if (hour == global.piketHour) {
			// console.log(`ini sudah lewat jam: ` + global.piketHour);
			sock.sendMessage(sender, {text: `ini sudah lewat jam: ` + global.piketHour});
		}
	}, 500);
}
module.exports = {
	dailyPiket,
};
