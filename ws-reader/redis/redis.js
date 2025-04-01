const Redis = require('ioredis');
const redis = new Redis();

const streamPrefix = 'binance';

const savePair = async (pairName, data) => {
  const streamKey = `${streamPrefix}:${pairName}`;
  redis.xadd(streamKey, '*', 'data', data);
}

module.exports = {
  savePair,
}