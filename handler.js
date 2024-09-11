function recieveMessage(){
    const connectToWhatsApp = require('./index');
    const { sock, commands, owner, thumbnail } = connectToWhatsApp;
    console.log(owner);
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
		try {
			if (type === "notify" && messages[0]?.message) {
				let prefix = global.prefix;
				const msg = messages[0];
				const sender = msg.key.remoteJid;
				const readSender = {
					remoteJid: msg.key.remoteJid,
					id: msg.key.id, // id of the message you want to read
					participant: msg.key.participant // the ID of the user that sent the  message (undefined for individual chats)
				};
				const date = new Date();
				/* const typeMedia =
					msg.message.extendedTextMessage.contextInfo.quotedMessage != null
						? Object.keys(msg.message.extendedTextMessage.contextInfo.quotedMessage)
						: Object.keys(msg.message) */
				const text =
					msg.message.extendedTextMessage?.text != null
						? msg.message.extendedTextMessage.text.toLowerCase()
						: msg.message.imageMessage?.caption != null
						? msg.message.imageMessage.caption.toLowerCase()
						: msg.message.conversation != null
						? msg.message.conversation.toLowerCase()
						: "";

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
						const commandName = text.split(" ")[0].substring(1).toLowerCase(); // Mengambil nama command setelah `?`
						// Mengeksekusi fungsi command jika ada
						if (commands[commandName]) {
							if (commands[commandName].owner && owner != sender) {
								//Mengecek jika bukan owner
								await sock.sendMessage(sender, { text: "hanya owner" });
							} else {
								try {
									if(msg.message.imageMessage){ //cek apakah command mengandung gambar
										console.log(`<no reply>` + Object.keys(msg.message)[0]);
										const buffer = await downloadMediaMessage( //download message media
											msg,
											'buffer',
											{ },
											{ 
												logger,
												// pass this so that baileys can request a reupload of media
												// that has been deleted
												reuploadRequest: sock.updateMediaMessage
											}
										)
										// save to file
										await writeFile('./media/image/test.jpeg', buffer)
									} /* else if(msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage){
										console.log(`<no reply>` + Object.keys(msg.message)[0]);
										const buffer = await downloadMediaMessage( //download message media
											msg,
											'buffer',
											{ },
											{ 
												logger,
												// pass this so that baileys can request a reupload of media
												// that has been deleted
												reuploadRequest: sock.updateMediaMessage
											}
										)
										// save to file
										await writeFile('./media/image/test.jpeg', buffer)
									} */
									console.log("ada command");
									await commands[commandName].execute({
										sock: sock,
										msg: msg,
										msgText: text,
										commands: commands,
                                        thumbnail: thumbnail
									});
								} catch (err) {
									console.log(`Error executing command ${commandName}:`, err);
								}
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
    recieveMessage
};