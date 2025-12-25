
const https = require('https');

const fetchJson = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.log("Error parsing JSON from " + url);
                    resolve([]);
                }
            });
        }).on('error', reject);
    });
};

(async () => {
    console.log("Fetching Students...");
    const students = await fetchJson('https://6939863fc8d59937aa082cb5.mockapi.io/students');
    console.log("Students:", students.slice(0, 3));

    console.log("Fetching Submissions...");
    const submissions = await fetchJson('https://69393fa6c8d59937aa0706bf.mockapi.io/submissions');
    console.log("Submissions:", submissions.slice(0, 3));
})();
