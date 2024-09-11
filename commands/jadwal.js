const fs = require("fs");
const path = require("path");

module.exports = {
  name: "jadwal",
  execute: async ({sock, msg, thumbnail}) => {
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

    try {
        // Kirim gambar dengan thumbnail
        await sock.sendMessage(
          sender,
          {
            image: fs.readFileSync("./media/image/jadwal.jpg"),
            caption: "noh jadwal",
            jpegThumbnail: thumbnail("./media/image/jadwal.jpg"),  // Tambahkan thumbnail sebagai buffer
          },
          { quoted: msg }
        );
    } catch (err) {
      console.error("Error saat mengirim balasan:", err);
    }
  },
};
