// ws-server/index.js

const mysql = require('mysql2');
const WebSocket = require('ws');

const PORT = 3001;

const wss = new WebSocket.Server({ port: PORT });
console.log(`WebSocket server running on ws://localhost:${PORT}`);

//  Connect to Laravel DB (from .env)
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '', 
  database: 'wasselni'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    return;
  }
  console.log('Connected to Laravel MySQL (wasselni)');
});
let lastRideId = 0;

setInterval(() => {
  db.query('SELECT * FROM rides WHERE id > ? ORDER BY id DESC LIMIT 1', [lastRideId], (err, results) => {
    if (err) return console.error('MySQL query error:', err);

    if (results.length > 0) {
      const ride = results[0];
      lastRideId = ride.id;

      console.log('🚕 New ride detected:', ride);

      // Send to all connected clients (you can filter later by role/user)
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'new_ride',
            data: ride
          }));
        }
      });
    }
  });
}, 1000); // check every 1 second
