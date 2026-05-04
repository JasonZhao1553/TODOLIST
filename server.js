const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    // allow the browser page to POST here
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return;}

    if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const filename = `tasks-${Date.now()}.json`;
            fs.writeFileSync(filename, body);
            console.log(`saved ${filename}`);
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({ok : true, file : filename}));
        });
        return;
    }
    res.writeHead(404); res.end();
}).listen(3000, () => console.log('listenting on http://localhost:3000'));