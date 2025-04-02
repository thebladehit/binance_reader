const Redis = require('ioredis');
const { REDIS_PIPELINE_TIMEOUT } = require('../config/config');
const redis = new Redis();

const streamPrefix = 'binance';

let pipeline = redis.pipeline();

const savePair = async (pairName, data) => {
  const streamKey = `${streamPrefix}:${pairName}`;
  pipeline.xadd(streamKey, '*', 'data', data);
}

setInterval(() => {
  if (pipeline.length !== 0) {
    pipeline.exec();
    pipeline = redis.pipeline();
  }
}, REDIS_PIPELINE_TIMEOUT);

module.exports = { savePair };