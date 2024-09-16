const fs = require('fs');
const path = './messages.json';
const MAX_MESSAGES = 20;

async function readMessagesFromFile() {
    const path = './messages.json';
    try {
        if (fs.existsSync(path)) {
            const data = await fs.promises.readFile(path, 'utf8');
            return JSON.parse(data);
        } else {
            return [];
        }
    } catch (err) {
        console.error('Error reading messages from file:', err);
        return [];
    }
}

async function findMessageByMediaKeyTimestamp(timestamp) {
    let messages = await readMessagesFromFile();

    // Mencari pesan yang memiliki imageMessage dengan mediaKeyTimestamp yang sesuai
    const result = messages.find(msg => 
        msg.message && 
        msg.message.imageMessage && 
        msg.message.imageMessage.mediaKeyTimestamp == timestamp
    );

    return result || null; // Mengembalikan null jika tidak ditemukan
}

// Contoh penggunaan
/* (async () => {
    const timestamp = '1725980636';
    const foundMessage = await findMessageByMediaKeyTimestamp(timestamp);

    if (foundMessage) {
        console.log('Message found:', foundMessage);
    } else {
        console.log('Message not found with mediaKeyTimestamp:', timestamp);
    }
})(); */

async function saveMessagesToFile(messages) {
    try {
        await fs.promises.writeFile(path, JSON.stringify(messages, null, 2));
    } catch (err) {
        console.error('Error saving messages to file:', err);
    }
}

async function addMessage(msg) {
    let messages = await readMessagesFromFile();
    
    messages.push(msg);
    
    if (messages.length > MAX_MESSAGES) {
        messages.shift();
    }
    
    await saveMessagesToFile(messages);
}

module.exports = {
    readMessagesFromFile,
    saveMessagesToFile,
    addMessage
}
