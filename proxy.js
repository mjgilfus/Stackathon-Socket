const net = require('net');

const server = net.createServer((socket) => {
  console.log('Client connected to proxy');

  const serverSocket = net.createConnection(5000, '127.0.0.1', () => {
    console.log('Connected to server.');

    // Data relay between client and server
    socket.on('data', (data) => {
      const message = data.toString().trim();
      console.log(`Received from client and sent to server: ${message}`);
      serverSocket.write(`${message}\n`);
    });

    serverSocket.on('data', (data) => {
      const message = data.toString().trim();
      console.log(`Received from server: ${message}`);
      socket.write(`${message}\n`);
    });
  });

  socket.on('end', () => {
    console.log('Client disconnected from proxy');
    serverSocket.end();
  });

  serverSocket.on('end', () => {
    console.log('Server disconnected');
    socket.end();
  });
});

const port = 6000;
server.listen(port, () => {
  console.log(`Proxy listening on port ${port}`);
});
