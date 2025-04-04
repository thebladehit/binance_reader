const { savePair } = require('../redis/redis');
const { MESSAGES_TIMEOUT } = require('../config/config');
const { getPairNamesWithTradeStream } = require('../../common/parser/parser');
const { PAIRS_PATH } = require('../../common/constants/constanse');

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
    const pairNames = await getPairNamesWithTradeStream(PAIRS_PATH, '@trade');
    return pairNames;
  } catch (err) {
    console.error('Error getting pairs: ', err);
    process.exit(1);
  }
};

let requests = 0; // used to track operations count
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
  requests++;
};

setInterval(() => {
  console.log(requests);
  requests = 0;
}, MESSAGES_TIMEOUT);

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
};
