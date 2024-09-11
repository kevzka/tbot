const {
	makeWASocket,
	useMultiFileAuthState,
	DisconnectReason,
	downloadMediaMessage,
	Logger,
} = require("@whiskeysockets/baileys");
const Pino = require("pino");
const logger = Pino({ level: "silent" });
const Boom = require("@hapi/boom");
const fs = require("fs");
const { writeFile } = require("fs/promises");
const path = require("path");
const { userInfo } = require("os");
const loadCommands = require("./commands.js");
const { recieveMessage } = require("./handler.js");
const sharp = require('sharp');
let myWhatsAppId, owner;
global.prefix = "?";

// Membaca file JSON yang berisi config
fs.readFile("config.json", "utf8", (err, data) => {
	if (err) {
		console.error("Error reading file:", err);
		return;
	}
	try {
		const user = JSON.parse(data);
		({ myWhatsAppId, owner } = user);
	} catch (err) {
		console.error("Error parsing JSON:", err);
	}
});

async function thumbnail(mediaPath) {
	const imagePath = path.join(__dirname, String(mediaPath));
	const image = fs.readFileSync(imagePath);

	// Buat thumbnail dengan sharp
	const thumbnail = await sharp(image)
		.resize(200) // Ukuran thumbnail
		.jpeg()
		.toBuffer();
	return thumbnail;
}

//memuat semua commands
const commands = loadCommands();

//memulai koneksi dengan whatsapp
async function connectToWhatsApp() {
	const { state, saveCreds } = await useMultiFileAuthState("./auth");
	const sock = makeWASocket({
		auth: state,
		printQRInTerminal: true,
		logger: logger,
	});

	sock.ev.on("creds.update", saveCreds);

	sock.ev.on("connection.update", (update) => {
		const { connection, lastDisconnect } = update;
		if (connection === "close") {
			//koneksi tertutup
			const shouldReconnect = Boom.isBoom(lastDisconnect?.error)
				? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
				: true;
			console.log(
				"connection closed due to ",
				lastDisconnect?.error,
				", reconnecting ",
				shouldReconnect
			);
			if (shouldReconnect) {
				connectToWhatsApp();
			}
		} else if (connection === "open") {
			//koneksi tersambung
			console.log("opened connection");
			if (sock.user) {
				console.log("Nomor WhatsApp yang terkoneksi:", myWhatsAppId);
			} else {
				myWhatsAppId = `${sock.user.id.replace(
					":3@s.whatsapp.net",
					""
				)}@s.whatsapp.net`;
				console.log("sock.user tidak terdefinisi!");
			}
		}
	});
	module.exports = {
		sock,
		commands,
		owner,
		thumbnail,
		fs,
		path
	};
	recieveMessage();
}
connectToWhatsApp();
