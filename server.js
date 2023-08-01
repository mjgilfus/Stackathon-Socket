const net = require('net');

const clients = new Set(); // Use a Set to store connected sockets

const server = net.createServer((socket) => {
  console.log('Client connected');

  // Add the new socket to the clients set
  clients.add(socket);

  socket.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`Received from client: ${message}`);

    // Send an acknowledgment back to the client through the proxy
    const acknowledgment = `Received message: "${message}"`;
    const acknowledgmentWithUsername = `Server: ${acknowledgment}\n`;
    socket.write(acknowledgmentWithUsername);

    // Broadcast the received message to all connected clients (excluding the sender)
    clients.forEach((client) => {
      if (client !== socket) {
        client.write(`${message}\n`);
      }
    });
  });

  socket.on('end', () => {
    console.log('Client disconnected');
    // Remove the disconnected socket from the clients set
    clients.delete(socket);
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
