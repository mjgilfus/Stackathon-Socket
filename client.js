const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new net.Socket();

client.connect(6000, '127.0.0.1', () => {
  console.log('Connected to proxy.');

  // Prompt the user for a username
  rl.question('Enter your username: ', (username) => {
    console.log(`Welcome, ${username}! Start typing your messages.`);
    // Read user input and send messages to the server
    rl.on('line', (input) => {
      const message = `${username}: ${input}\n`;
      client.write(message);
    });
  });
});

client.on('data', (data) => {
  console.log('Received acknowledgment from proxy: ', data.toString());
});

client.on('close', () => {
  console.log('\nConnection to proxy closed.');
});
