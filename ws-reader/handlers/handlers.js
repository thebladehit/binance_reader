const { savePair } = require('../redis/redis');
const { getPairNames } = require('../parser/parser');
const path = require('node:path');

const PAIRS_PATH = path.resolve(__dirname, '..', 'assets', 'assets.txt');

const onOpen = async (socket) => {
  console.log('Connected to Binance socket server!\n');
  
  const pairNames = await getPairs();
  socket.send(JSON.stringify({
    method: 'SUBSCRIBE',
    params: pairNames,
    id: 0, // no matter
  }));
};

const getPairs = async () => {
  try {
    const pairNames = await getPairNames(PAIRS_PATH);
    return pairNames;
  } catch (err) {
    console.error('Error getting pairs: ', err);
    process.exit(1);
  }
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

const onClose = (msg) => {
  console.dir(msg.code);
};

const onError = (err) => {
  console.error(`Error(${new Date(Date.now()).toISOString()}): `, err);
};

module.exports = {
  onError,
  onOpen,
  onMessage,
  onClose,
}