const uWS = require('uWebSockets.js');

// Create a WebSocket App
const app = uWS.App();

// Store connected WebSocket clients
const clients = new Set();

// WebSocket server event handlers
app.ws('/*', {
  /* Options */
  compression: uWS.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 10,

  /* Handlers */
  open: (ws) => {
    // Add the new client to the set
    clients.add(ws);
    console.log('WebSocket connected');
  },

  message: (ws, message, isBinary) => {
    // Broadcast message to all connected clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === uWS.WebSocket.OPEN) {
        client.send(message);
      }
    });
  },

  close: (ws, code, message) => {
    // Remove the client from the set when it closes
    clients.delete(ws);
    console.log('WebSocket disconnected');
  }
});

// Start the server
app.listen(9001, (listenSocket) => {
  if (listenSocket) {
    console.log('Server listening on port 9001');
  }
});
