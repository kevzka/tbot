const { makeWASocket, useMultiFileAuthState, DisconnectReason, Logger } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const logger = Pino({ level: 'silent' });const Boom = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const { userInfo } = require('os');
const loadCommands = require('./commands.js');
let myWhatsAppId, owner;
global.prefix = '?';

// Membaca file JSON yang berisi config
fs.readFile('config.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const user = JSON.parse(data);
        ({ myWhatsAppId, owner } = user);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});

//memulai koneksi dengan whatsapp
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true, logger: logger });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') { //koneksi tertutup
            const shouldReconnect = Boom.isBoom(lastDisconnect?.error)
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') { //koneksi tersambung
            console.log('opened connection');
            if (sock.user) {
                console.log('Nomor WhatsApp yang terkoneksi:', myWhatsAppId);
            } else {
                myWhatsAppId = `${sock.user.id.replace(':3@s.whatsapp.net', '')}@s.whatsapp.net`;
                console.log('sock.user tidak terdefinisi!');
            }
        }
    });
    
    //memuat semua commands
    const commands = loadCommands();

    //menerima semua message
    sock.ev.on('messages.upsert', async (m) => {
        let prefix = global.prefix;
        const msg = m.messages[0];
        const sender = msg.key.remoteJid;
        const date = new Date();
        
        if (!msg.message) return; // Jika pesan kosong, keluar
        if (!msg.message.fromMe) { // Mengecek jika pesan bukan dari kamu sendiri
            if (msg.message.conversation) { // Mengecek jika pesan adalah teks
                const text = msg.message.conversation.toLowerCase();
                console.log(`<--------------------------------------->\nNo: ${msg.key.remoteJid.replace('@s.whatsapp.net', '')}\nNama: ${msg.pushName}\nMessage: ${text}\nTanggal: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                console.log(m.messages);
                console.log(m.type);
                
                // Mengecek jika pesan adalah sebuah command
                if (text.startsWith(prefix) && text.length > 1) {
                    const commandName = text.split(' ')[0].substring(1); // Mengambil nama command setelah `?`

                    // Mengeksekusi fungsi command jika ada
                    if (commands[commandName]) {
                        if (commands[commandName].owner && owner !== sender) { //Mengecek jika bukan owner
                            await sock.sendMessage(sender, { text: 'hanya owner' });
                        } else {
                            try {
                                console.log('ada command');
                                let msgText = msg.message.conversation;
                                await commands[commandName].execute(sock, msg, msgText);
                            } catch (err) {
                                console.log(`Error executing command ${commandName}:`, err);
                            }
                        }
                    } else {
                        await sock.sendMessage(sender, { text: 'Command tidak dikenal!' });
                    }                    
                }
            }

            // Menangani tipe pesan lain (gambar, video, voice note, dll.)
            if (msg.message.imageMessage) {
                console.log('Gambar diterima');
            }
            if (msg.message.videoMessage) {
                console.log('Video diterima');
            }
            if (msg.message.audioMessage) {
                console.log('Voice note diterima');
            }
        } else {
            console.log('Pesan berasal dari saya, tidak mengeksekusi command.');
        }
    });
}
connectToWhatsApp();