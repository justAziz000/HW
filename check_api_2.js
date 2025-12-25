
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
    await checkUrl('https://6939863fc8d59937aa082cb5.mockapi.io/students');
    await checkUrl('https://6939863fc8d59937aa082cb5.mockapi.io/users');
})();