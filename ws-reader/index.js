const { 
  onOpen,
  onError,
  onClose,
  onMessage,
} = require('./handlers/handlers');

const connectToServer = () => {
  const socket = new WebSocket('wss://stream.binance.com:9443/ws');
  socket.addEventListener('open', () => {
    onOpen(socket);
  });
  
  socket.addEventListener('error', (err) => {
    onError(err);
  });
  
  socket.addEventListener('message', (msg) => {
    onMessage(msg);
  });
  
  socket.addEventListener('close', (msg) => {
    onClose(msg);
    setTimeout(() => {
      connectToServer();
    }, 1000);
  });
}

connectToServer();