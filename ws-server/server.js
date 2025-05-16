// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Store connections with their roles and IDs
const clients = new Map();

wss.on('connection', function connection(ws, req) {
  console.log('New client connected');

  // Store metadata about client after handshake message
  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);

      // Initial handshake from client with role and userId
      if (data.type === 'handshake') {
        clients.set(ws, { role: data.role, userId: data.userId });
        ws.send(JSON.stringify({ type: 'handshake_ack', message: 'Connected to server' }));
        console.log(`Handshake: ${data.role} ${data.userId}`);
        return;
      }

      // Broadcast ride status or messages to the other party
      if (data.type === 'ride_status_update' || data.type === 'ride_message') {
        // Find the other client in this ride (simplified)
        for (const [client, meta] of clients.entries()) {
          if (
            client !== ws &&
            (meta.userId === data.targetUserId || meta.role !== clients.get(ws).role)
          ) {
            client.send(JSON.stringify(data));
          }
        }
      }
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8080');
