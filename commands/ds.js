const { raw } = require("body-parser");
const Groq = require("groq-sdk");

const client = new Groq({
	apiKey: "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", // bisa juga ditulis langsung jika tidak pakai .env
});

module.exports = {
	name: "ds",
	execute: async ({ sock, msg, msgtext }) => {
        const sender = msg.key.remoteJid;
        let teks = msgtext.split(' ');
        console.log(teks);
        teks.splice(0,1);
        console.log(teks);
        teks = teks.join(' ');w
		async function run() {
			try {
				const chatCompletion = await client.chat.completions.create({
					messages: [{ role: "user", content: teks }],
					model: "deepseek-r1-distill-llama-70b",
				});

                let rawText = chatCompletion.choices[0].message.content;
                let cleaned = rawText.replace(/<think>\s*<\/think>\s*/g, '');


                await sock.sendMessage(sender, { text: `${cleaned}` }, { quoted: msg });
			} catch (error) {
				console.error("Error during chat completion:", error);
			}
		}
        run()
	},
};
