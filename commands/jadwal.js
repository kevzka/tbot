const sharp = require('sharp');
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "jadwal",
  execute: async ({sock, msg}) => {
    const sender = msg.key.remoteJid;
    const date = new Date();
    const jadwal = {
      senin: "tes, tes, tes",
      selasa: "tes, tes, tes",
      rabu: "tes, tes, tes",
      kamis: "tes, tes, tes",
      jumat: "tes, tes, tes",
    };
    const hari = [
      "minggu",
      "senin",
      "selasa",
      "rabu",
      "kamis",
      "jumat",
      "sabtu",
    ];
    const hariIni = hari[date.getDay()];
    const send = `jadwal hari ini\n${hariIni}: ${jadwal[hariIni]}`;
    const isGroupMessage = sender.endsWith("@g.us");

    // Tentukan path yang benar untuk file jadwal.jpg dan thumbnail
    const imagePath = path.join(__dirname, '../jadwal.jpg');

    try {
      // Baca gambar utama
      const image = fs.readFileSync(imagePath);

      // Buat thumbnail dengan sharp
      const thumbnail = await sharp(image)
        .resize(200) // Ukuran thumbnail
        .jpeg()
        .toBuffer();

        // Kirim gambar dengan thumbnail
        await sock.sendMessage(
          sender,
          {
            image: image,
            caption: "Here is your image!",
            jpegThumbnail: thumbnail,  // Tambahkan thumbnail sebagai buffer
          },
          { quoted: msg }
        );
    } catch (err) {
      console.error("Error saat mengirim balasan:", err);
    }
  },
};
