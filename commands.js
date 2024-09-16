const fs = require('fs');
const path = require('path');

function loadCommands() {
    console.log('loadCommands terpanggil');
    const commands = {};
    let owner = '';
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        try {
            const command = require(`./commands/${file}`);
            if (command.name && typeof command.execute === 'function') {
                commands[command.name] = { ...command };
                console.log(file + ` done ` + global.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            } else {
                console.error(`File ${file} tidak memiliki struktur yang benar.`);
            }
        } catch (error) {
            console.error(`Error saat memuat file ${file}: ${error.message}`);
        }
    }

    return commands;
}
module.exports = loadCommands;

