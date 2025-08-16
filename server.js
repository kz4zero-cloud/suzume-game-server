// server.js
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});

const wss = new WebSocket.Server({ server });
let players = {};

wss.on('connection', ws => {
  const id = Math.random().toString(36).substr(2, 9);
  players[id] = { x: 100, y: 100 };

  ws.send(JSON.stringify({ type: 'init', id, players }));

  ws.on('message', message => {
    const data = JSON.parse(message);
    if (data.type === 'move') {
      players[id] = data.pos;
      broadcast({ type: 'update', id, pos: data.pos });
    }
  });

  ws.on('close', () => {
    delete players[id];
    broadcast({ type: 'remove', id });
  });
});

function broadcast(msg) {
  const data = JSON.stringify(msg);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

server.listen(3000, () => {
  console.log('サーバー起動: http://localhost:3000');
});
