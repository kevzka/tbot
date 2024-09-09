const fs = require('fs');
const sharp = require('sharp');

module.exports = {
    name: 'stiker',
    execute: async ({sock, msg}) => {
        try {
            const filePath = './media/image/images.webp'; // Path ke file stiker animasi
            
            // Ubah ukuran gambar menjadi persegi 512x512 tanpa mengubah aspek rasio
            const stikerBuffer = await sharp(filePath)
                .resize(512, 512, {
                    fit: 'contain', // Memastikan gambar muat di dalam ukuran 512x512
                    background: { r: 0, g: 0, b: 0, alpha: 0 } // Background transparan untuk padding
                })
                .toBuffer();

            const thumbnail = await sharp(filePath)
                .resize(200) // Ukuran thumbnail
                .jpeg()
                .toBuffer();

            let send = { 
                sticker: stikerBuffer,  // Buffer dari file stiker animasi yang sudah diubah ukurannya
                isAnimated: true,
                jpegThumbnail: thumbnail,
                mimetype: 'image/webp'  // Format MIME untuk stiker animasi adalah 'image/webp'
            }
            
            // Mengirim stiker animasi
            const sender = msg.key.remoteJid;
            await sock.sendMessage(sender, send, { quoted: msg });

        } catch (error) {
            console.error('Error executing command stiker:', error);
        }
    }
};