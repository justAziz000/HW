
const https = require('https');

const postJson = (url, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
        });

        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
};

(async () => {
    // Populate Aziz Karimov
    const aziz = {
        id: "2",
        name: "Aziz Karimov",
        coins: 0,
        groupId: "NF-2941", // From screenshot
        email: "aziz@example.com", // Dummy
        password: "123" // Dummy
    };

    console.log("Populating Aziz...");
    try {
        const res = await postJson('https://6939863fc8d59937aa082cb5.mockapi.io/students', aziz);
        console.log("Result:", res);
    } catch (e) {
        console.error(e);
    }
})();
