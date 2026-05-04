const http = require('http');
const Database = require('better-sqlite3');

const db = new Database('todo.db');
db.exec(`
    CREATE TABLE IF NOT EXISTS lists (
        user_id INTEGER PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at INTEGER NOT NULL
    )
`);

const upsert = db.prepare(
    'INSERT OR REPLACE INTO lists (user_id, data, updated_at) VALUES (?, ?, ?)'
);
const selectByUser = db.prepare('SELECT data FROM lists WHERE user_id = ?');

http.createServer((req, res) => {
    // allow the browser page to POST here
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return;}

    if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const parsed = JSON.parse(body);
            const userId = Number(parsed.userID);
            upsert.run(userId, body, Date.now());
            console.log(`saved list for user ${userId}`);
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({ok : true, user_id : userId}));
        });
        return;
    }

    if (req.method === 'GET' && req.url.startsWith('/load')) {
        const url = new URL(req.url, 'http://localhost');
        const userId = Number(url.searchParams.get('userID'));
        const row = selectByUser.get(userId);
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(row ? row.data : JSON.stringify({tasks : []}));
        return;
    }

    res.writeHead(404); res.end();
}).listen(3000, () => console.log('listenting on http://localhost:3000'));
