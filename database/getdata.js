const axios = require('axios');

let kasmurid;
const ipbpk = '192.168.78.138';
const ipkvin = '192.168.43.138';

async function fetchData() {
    try {
        const response = await axios.get(`http://${ipkvin}/whatsapp/database/get_data.php`);
        const kasmurid = response.data; // Menampilkan data setelah didefinisikan
        return kasmurid;
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
}

module.exports = fetchData;