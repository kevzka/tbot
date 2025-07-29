const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: "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", // bisa juga ditulis langsung jika tidak pakai .env
});

async function run() {
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'jelaskan apa itu phi' }],
      model: 'deepseek-r1-distill-llama-70b',
    });

    console.log(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error('Error during chat completion:', error);
  }
}

run();
