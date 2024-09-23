const loadCommands = require("./commands.js");
const path = require("path");
const fs = require("fs");
//memuat semua commands

let commands = loadCommands();

// Function to reload commands
function reloadCommands() {
    console.log("Reloading commands...");
    commands = loadCommands(); // Reload commands
    console.log("Commands reloaded.");
}

// Function to watch files in the commands folder
function watchCommandFiles() {
    const commandsPath = path.join(__dirname, "commands");

    fs.readdir(commandsPath, (err, files) => {
        if (err) {
            console.error("Error reading commands directory:", err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(commandsPath, file);
            // Watch each individual file
            fs.watchFile(filePath, (curr, prev) => {
                if (curr.mtime !== prev.mtime) {
                    console.log(`${file} was modified, reloading commands...`);
                    reloadCommands();
                }
            });
        });
    });
}

// Start watching command files
watchCommandFiles();

function recieveMessage() {
	const {
		readMessagesFromFile,
		saveMessagesToFile,
		addMessage,
	} = require("./memory");
	const connectToWhatsApp = require("./index");
	const {
		sock,
		owner,
		thumbnail,
		downloadMediaMessage,
		logger,
		writeFile,
	} = connectToWhatsApp;
	let prefix, msg, isGroup, sender, readSender, date, text, commandName;
	const { dailyPiket } = require('./commands/__dailyPiket');
	dailyPiket({sock: sock});

	async function checkMessage() {
		console.log(`${commands[commandName].owner} ${owner.includes(sender)} ${commands[commandName].onlyGroup} ${isGroup}`); //debugging
		if (commands[commandName].owner && !owner.includes(sender)) {
		//Mengecek jika bukan owner
		await sock.sendMessage(sender, { text: "hanya owner" });
		return `owner`
	} else if (commands[commandName].onlyGroup && !isGroup) {
		await sock.sendMessage(
			sender,
			{ text: `hanya bisa di pakai di grup` },
			{ quoted: msg }
		);
		return `onlyGroup`
	} else { return true; }
	}



	sock.ev.on("messages.upsert", async ({ messages, type }) => {
		try {
			if (type === "notify" && messages[0]?.message) {
				await addMessage(messages[0]);
				prefix = global.prefix;
				msg = messages[0];
				isGroup = msg.key.remoteJid.endsWith("@g.us");
				sender =
					msg.key.participant != undefined
						? msg.key.participant
						: msg.key.remoteJid;
				readSender = {
					remoteJid: msg.key.remoteJid,
					id: msg.key.id, // id of the message you want to read
					participant: msg.key.participant, // the ID of the user that sent the  message (undefined for individual chats)
				};
				date = new Date();
				text =
					msg.message.extendedTextMessage?.text?.toLowerCase() ??
					msg.message.imageMessage?.caption?.toLowerCase() ??
					msg.message.conversation?.toLowerCase() ??
					"";

				console.log(
					`<--------------------------------------->\nNo: ${msg.key.remoteJid.replace(
						"@s.whatsapp.net",
						""
					)}\nNama: ${
						msg.pushName
					}\nMessage: ${text}\nTanggal: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
				);
				console.log(msg);
				console.log(text);
				// console.log(type);
				await sock.readMessages([readSender]);
				if (!msg.message) return; // Jika pesan kosong, keluar
				if (!msg.message.fromMe) {
					// Mengecek jika pesan adalah sebuah command
					if (text.startsWith(prefix) && text.length > 1) {
						commandName = text.split(" ")[0].substring(1).toLowerCase(); // Mengambil nama command setelah `?`
						// Mengeksekusi fungsi command jika ada
						if (commands[commandName]) {
							try {
								const checkResult = await checkMessage();
								console.log(checkResult);
								if (checkResult === true) {
									// handleMediaMessage(msg);
									console.log("ada command");
									await commands[commandName].execute({
										sock: sock,
										msg: msg,
										msgtext: text,
										commands: commands,
										thumbnail: thumbnail,
										time: time
									});
								}
							} catch (err) {
								console.log(`Error executing command ${commandName}:`, err);
							}
						} else {
							await sock.sendMessage(sender, {
								text: "Command tidak dikenal!",
							});
						}
					}

					// Menangani tipe pesan lain (gambar, video, voice note, dll.)
					if (msg.message.imageMessage) {
						console.log("Gambar diterima");
					}
					if (msg.message.videoMessage) {
						console.log("Video diterima");
					}
					if (msg.message.audioMessage) {
						console.log("Voice note diterima");
					}
				} else {
					console.log("Pesan berasal dari saya, tidak mengeksekusi command.");
				}
			}
		} catch (err) {
			console.log(`ada yang error bagian(index.js(message.upsert) : ${err}`);
		}
	});
}

module.exports = {
	recieveMessage,
};


/* async function handleMediaMessage(msg) {
    const fs = require("fs");
    const connectToWhatsApp = require('./index');
    const { sock, downloadMediaMessage, logger } = connectToWhatsApp;
    let mediaMessage;
    let mediaType;
    let timestamp = msg.messageTimestamp || Date.now(); // Gunakan timestamp dari pesan atau waktu saat ini jika tidak tersedia

    // Cek media di pesan utama
    if (msg.message.imageMessage) {
        mediaMessage = msg.message.imageMessage;
        mediaType = 'image/jpeg';
    } else if (msg.message.videoMessage) {
        mediaMessage = msg.message.videoMessage;
        mediaType = 'video/mp4';
    } else if (msg.message.audioMessage) {
        mediaMessage = msg.message.audioMessage;
        mediaType = 'audio/mp4';
    } else if (msg.message.documentMessage) {
        mediaMessage = msg.message.documentMessage;
        mediaType = msg.message.documentMessage.mimetype; // Format MIME type dari dokumen
    } else if (msg.message.extendedTextMessage && 
               msg.message.extendedTextMessage.contextInfo && 
               msg.message.extendedTextMessage.contextInfo.quotedMessage) {
        const quotedMessage = msg.message.extendedTextMessage.contextInfo.quotedMessage;
        
        if (quotedMessage.imageMessage) {
            mediaMessage = quotedMessage.imageMessage;
            mediaType = 'image/jpeg';
        } else if (quotedMessage.videoMessage) {
            mediaMessage = quotedMessage.videoMessage;
            mediaType = 'video/mp4';
        } else if (quotedMessage.audioMessage) {
            mediaMessage = quotedMessage.audioMessage;
            mediaType = 'audio/mp4';
        } else if (quotedMessage.documentMessage) {
            mediaMessage = quotedMessage.documentMessage;
            mediaType = quotedMessage.documentMessage.mimetype; // Format MIME type dari dokumen
        }
    }

    if (mediaMessage) {
        try {
            const buffer = await downloadMediaMessage(
                msg, // Kirim objek pesan dengan format yang benar
                'buffer',
                {},
                { 
                    logger,
                    reuploadRequest: sock.updateMediaMessage
                }
            );

            // Menentukan ekstensi file berdasarkan tipe media
            const extension = mediaType.split('/')[1] || 'bin';
            const fileName = `./media/${timestamp}.${extension}`; // Nama file menggunakan timestamp dari pesan

            // Simpan buffer ke file
            await fs.promises.writeFile(fileName, buffer);
            console.log(`Media saved as ${fileName}`);
        } catch (error) {
            console.error('Error downloading or saving media:', error);
        }
    } else {
        console.log('No media found in the message or its quoted message.');
    }
} */