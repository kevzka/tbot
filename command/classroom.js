const main = require("../google.js");

module.exports = {
  name: "tugas",
  execute: async (sock, msg) => {
    const sender = msg.key.remoteJid;
    await sock.sendMessage(sender, { text: `sedang di proses...` }, { quoted: msg });
    try {
      const teks = await main(); // Menunggu hasil dari main()
      const messageContent = teks
        ? { text: teks }
        : { text: "Tidak ada konten yang tersedia." };
      await sock.sendMessage(sender, messageContent, { quoted: msg });
    //   await sock.sendMessage(sender, { text: teks }, { quoted: msg }); // Mengirimkan teks hasil dari main()
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
