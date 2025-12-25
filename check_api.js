
const https = require('https');

const checkUrl = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            console.log(`${url}: ${res.statusCode}`);
            resolve();
        }).on('error', (e) => {
            console.error(e);
            resolve();
        });
    });
};

(async () => {
    await checkUrl('https://69393fa6c8d59937aa0706bf.mockapi.io/students');
    await checkUrl('https://69393fa6c8d59937aa0706bf.mockapi.io/users');
})();
