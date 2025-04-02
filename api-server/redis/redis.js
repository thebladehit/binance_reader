const Redis = require('ioredis');
const redis = new Redis();

const streamPrefix = 'binance';

const readPairsPrice = (pairNames) => {
  const pipeline = redis.pipeline();
  for (const pairName of pairNames) {
    if (pairName.length === 0) {
      continue;
    }
    const streamKey = `${streamPrefix}:${pairName}`;
    pipeline.xrevrange(streamKey, '+', '-', 'COUNT', 1);
  }
  return pipeline.exec();
};

module.exports = { readPairsPrice }