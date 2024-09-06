const { makeWASocket, useMultiFileAuthState, DisconnectReason, Logger } = require('@whiskeysockets/baileys');
const Pino = require('pino');
// Menggunakan Pino untuk mengatur level logging hanya pada 'error' saja
const logger = Pino({ level: 'silent' });const Boom = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const { userInfo } = require('os');

// Masukkan nomor WhatsApp kamu di sini
let myWhatsAppId = '62xxxxxxx@s.whatsapp.net'; // Ganti dengan remoteJid kamu

// Function untuk memuat semua command secara dinamis dari folder commands
function loadCommands() {
    const commands = {};
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands[command.name] = command.execute;
    }
    return commands;
}
function chatlog(){
    
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true, logger: logger });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = Boom.isBoom(lastDisconnect?.error)
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('opened connection');
            if (sock.user) {
                console.log('Nomor WhatsApp yang terkoneksi:', myWhatsAppId);
            } else {
                myWhatsAppId = `${sock.user.id.replace(':3@s.whatsapp.net', '')}@s.whatsapp.net`;
                console.log('sock.user tidak terdefinisi!');
            }
        }
    });
    
    // Memuat semua command
    const commands = loadCommands();
    
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        const sender = msg.key.remoteJid;
        const date = new Date();
        
        if (!msg.message) return; // Jika pesan kosong, keluar
        
        // Mengecek jika pesan bukan dari kamu sendiri
        if (!msg.key.fromMe) {
            // Mengecek jika pesan adalah teks
            if (msg.message.conversation) {
                const text = msg.message.conversation.toLowerCase();
                console.log(`<--------------------------------------->\nNo: ${msg.key.remoteJid.replace('@s.whatsapp.net', '')}\nNama: ${msg.pushName}\nMessage: ${text}\nTanggal: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                console.log(m.messages);
                console.log(m.type);
                
                // Mengecek jika pesan adalah sebuah command
                if (text.startsWith('?')) {
                    const commandName = text.split(' ')[0].substring(1); // Mengambil nama command setelah `?`

                    // Mengeksekusi fungsi command jika ada
                    if (commands[commandName]) {
                        try {
                            await commands[commandName](sock, msg); // Eksekusi command
                        } catch (err) {
                            console.log(`Error executing command ${commandName}:`, err);
                        }
                    } 
                    /* else if(commands[commandName]) {
                        await sock.sendMessage(sender, { text: 'Command tidak dikenal!' });
                    } */
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

