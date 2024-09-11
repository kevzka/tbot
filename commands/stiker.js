const fs = require('fs');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
    name: 'stiker',
    execute: async ({ sock, msg }) => {
        try {
            const filePath = './media/image/grant.webp'; // Path ke file stiker
            const stikerBuffer = fs.readFileSync(filePath);

            // Membuat stiker dengan packname dan author
            const sticker = new Sticker(stikerBuffer, {
                pack: 'My Pack', // Nama pack stiker
                author: 'My Author', // Nama author
                type: StickerTypes.FULL, // Jenis stiker (FULL, CROP, atau DEFAULT)
                quality: 75, // Kualitas stiker (0-100)
            });

            const stikerBufferWithMetadata = await sticker.toBuffer();

            // Mengirim stiker dengan metadata
            const sender = msg.key.remoteJid;
            await sock.sendMessage(sender, {
                sticker: stikerBufferWithMetadata,  // Buffer stiker dengan metadata
                mimetype: 'image/webp',  // Format MIME untuk stiker adalah 'image/webp'
            }, { quoted: msg });

        } catch (error) {
            console.error('Error executing command stiker:', error);
        }
    }
};
