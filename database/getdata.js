const axios = require('axios');

axios.get('http://192.168.43.138/whatsapp/get_data.php')
    .then(response => {
        console.log('Data yang diterima:', response.data);
    })
    .catch(error => {
        console.error('Terjadi kesalahan:', error);
    });