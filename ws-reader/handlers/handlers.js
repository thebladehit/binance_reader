const { savePair } = require("../redis/redis");

const onError = (error) => {
  console.error(`Error(${new Date(Date.now()).toISOString()}): `, err);
};

const onOpen = (socket) => {
  console.log('Connected to Binance socket server!\n');
  
  socket.send(JSON.stringify({
    method: "SUBSCRIBE",
    params: [
      "btcusdt@trade",
      'adausdt@trade',
    ],
    id: 0, // no matter
  }));
};

const onClose = (code, reason) => {
  console.log(`Connection was closed. Code: ${code}. Reason: ${reason}`);
};

const onMessage = (msg) => {
  const data = JSON.parse(msg.data);

  if (data.id === 0) {
    return;
  }

  const dataToSave = JSON.stringify({
    tradeId: data.t,
    price: data.p,
    quantity: data.q,
    timestamp: data.T,
  });
  savePair(data.s.toLowerCase(), dataToSave);
};

module.exports = {
  onError,
  onOpen,
  onMessage,
  onClose,
}