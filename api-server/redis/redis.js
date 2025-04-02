const Redis = require('ioredis');
const { PAIR_STAT_COUNT } = require('../config/config');
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

const readPairsPriceStat = (pairName, timeInterval) => {
  const pipeline = redis.pipeline();
  let curTime = Date.now();
  for (let i = 0; i < PAIR_STAT_COUNT; i++) {
    const streamKey = `${streamPrefix}:${pairName}`;
    const timeId = `${curTime}-0`;
    pipeline.xread('COUNT', 1, 'STREAMS', streamKey, timeId);
    curTime -= timeInterval;
  }
  return pipeline.exec();
};

module.exports = { 
  readPairsPrice,
  readPairsPriceStat,
};