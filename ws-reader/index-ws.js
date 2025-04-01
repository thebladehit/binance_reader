const { buffer } = require('stream/consumers');
const WebSocket = require('ws');

const socket = new WebSocket('wss://stream.binance.com:9443/ws');

let id = 0;

socket.on('open', () => {
  console.log('Connected to Binance socket server!');
  // socket.send(JSON.stringify({
  //   method: "SUBSCRIBE",
  //   params: [
  //     "btcusdt@trade"
  //   ],
  //   id
  // }));
});

socket.on('error', (err) => {
  console.error('Error: ', err);
});

socket.on('message', (msg) => {
  const data = JSON.parse(msg.data);
});

socket.on('close', (code, reason) => {
  console.log(`Connection was closed. Code: ${code}. Reason: ${reason}`);
});

socket.on('ping', (data) => {
  console.log('ping', data.toString('utf-8'));
});
