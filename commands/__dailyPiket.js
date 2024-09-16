function dailyPiket() {
	setInterval(() => {
		let hour = global.time.toLocaleTimeString("id-ID", { hour: "2-digit" });
		console.log(`ini sudah belum jam: ` + global.piketHour);
		if (hour == global.piketHour) {
			console.log(`ini sudah lewat jam: ` + global.piketHour);
		}
	}, 500);
}
module.exports = {
	dailyPiket,
};
