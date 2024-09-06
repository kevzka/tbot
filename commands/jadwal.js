module.exports = {
    name: 'jadwal',
    execute: async (sock, msg) => {
        const sender = msg.key.remoteJid;
        const date = new Date();
        const jadwal = {
            senin: 'tes, tes, tes',
            selasa: 'tes, tes, tes',
            rabu: 'tes, tes, tes',
            kamis: 'tes, tes, tes',
            jumat: 'tes, tes, tes'
        }
        const hari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
        const hariIni = hari[date.getDay()];
        const send = `jadwal hari ini\n${hariIni}: ${jadwal[hariIni]}`;
        const isGroupMessage = sender.endsWith('@g.us');
        try {
            // Mengecek apakah pesan berasal dari grup dan memiliki messageId
            if (isGroupMessage && msg.key.participant) {
                // Kirim balasan dengan quoted untuk pesan grup
                await sock.sendMessage(sender, { text: send }, { quoted: msg });
            } else {
                // Kirim balasan tanpa quoted jika tidak ada messageId yang valid
                await sock.sendMessage(sender, { text: send });
            }
        } catch (err) {
            console.error('Error saat mengirim balasan:', err);
        }
    }
};
