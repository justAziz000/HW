
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
                    resolve([]);
                }
            });
        }).on('error', reject);
    });
};

(async () => {
    console.log("Fetching Submissions...");
    const submissions = await fetchJson('https://69393fa6c8d59937aa0706bf.mockapi.io/submissions');
    console.log("Submissions count:", submissions.length);

    // Extract unique students
    const students = {};
    submissions.forEach(s => {
        if (s.studentId && !students[s.studentId]) {
            students[s.studentId] = {
                id: s.studentId,
                name: s.studentName,
                // Make a best guess for other fields or leave empty
                coins: 0
            };
        }
    });

    console.log("Found Students in Submissions:", Object.values(students));
})();
