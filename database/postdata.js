const axios = require('axios');
const fetchdata = require("./getdata.js");

async function postData({name: name, nominal: nominal}) {
    const kasmurid = await fetchdata();
    const index = kasmurid.findIndex(item => item.nama === name);
    const nominalbefore = kasmurid[index].nominal;
    const nominalafter = Number(nominalbefore) + Number(nominal);
    const bayar = (nominalafter >= 0) ? 'true' : 'false';
    try {
        const response = await axios.post('http://192.168.43.138/whatsapp/database/post_data.php', {
            name: name, // Ganti dengan data yang ingin kamu kirim
            nominal: nominalafter,
            bayar: bayar
        });
        console.log(response.data); // Menampilkan respon dari PHP
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
    return {name: name, nominal: nominal};
}

module.exports = postData;
