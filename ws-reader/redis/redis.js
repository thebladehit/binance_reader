const Redis = require('ioredis');
const { REDIS_PIPELINE_TIMEOUT } = require('../config/config');
const redis = new Redis();

const streamPrefix = 'binance';

const pipeline = redis.pipeline();

const savePair = async (pairName, data) => {
  const streamKey = `${streamPrefix}:${pairName}`;
  pipeline.xadd(streamKey, '*', 'data', data);
}

setInterval(() => {
  pipeline.exec();
}, REDIS_PIPELINE_TIMEOUT);

module.exports = { savePair }