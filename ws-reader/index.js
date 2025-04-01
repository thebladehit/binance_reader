const socket = new WebSocket('wss://stream.binance.com:9443/ws');
const { 
  onOpen,
  onError,
  onClose,
  onMessage,
} = require('./handlers/handlers');

socket.addEventListener('open', () => {
  onOpen(socket);
});

socket.addEventListener('error', (err) => {
  onError(err);
});

socket.addEventListener('message', (msg) => {
  onMessage(msg);
});

socket.addEventListener('close', (code, reason) => {
  onClose(code, reason);
});