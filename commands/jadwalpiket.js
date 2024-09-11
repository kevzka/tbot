const fs = require('fs');
module.exports = {
    name: 'piket',
    execute: async ({sock, msg, msgText, thumbnail}) => {
        const piket = {
            senin: './media/image/senin-selasa.jpg',
            selasa: './media/image/senin-selasa.jpg',
            rabu: './media/image/rabu-kamis.jpg',
            kamis: './media/image/rabu-kamis.jpg',
            jumat: './media/image/jumat.jpg'
        }
        const date = new Date();
        const hari = ['minggu','senin','selasa','rabu','kamis','jumat'];
        const sender = msg.key.remoteJid;
        const send = {
            image: fs.readFileSync(piket[hari[date.getDay()]]),
            caption: `piket hari ${hari[date.getDay()]}`,
            jpegThumbnail: thumbnail(piket[hari[date.getDay()]])
        }

        try{
            await sock.sendMessage(sender, send, { quoted: msg })
        } catch (err){
            console.log(`jadwal piket error ${err}`)
        }
    }
};
