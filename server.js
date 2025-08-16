// server.js (CommonJS + Render対応)
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  // Health check (Render)
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }

  // 静的ファイル配信（超簡易）
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(publicDir, path.normalize(urlPath));

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }
    // 簡易MIME（必要最低限）
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === '.html' ? 'text/html; charset=utf-8' :
      ext === '.js'   ? 'text/javascript; charset=utf-8' :
      ext === '.css'  ? 'text/css; charset=utf-8' :
      ext === '.json' ? 'application/json; charset=utf-8' :
      'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server });
const players = {};

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).slice(2, 11);
  players[id] = { x: 100, y: 100 };

  ws.send(JSON.stringify({ type: 'init', id, players }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'move' && data.pos) {
        players[id] = data.pos;
        broadcast({ type: 'update', id, pos: data.pos });
      }
    } catch (_) { /* ignore bad JSON */ }
  });

  ws.on('close', () => {
    delete players[id];
    broadcast({ type: 'remove', id });
  });
});

function broadcast(msg) {
  const data = JSON.stringify(msg);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  });
}

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
