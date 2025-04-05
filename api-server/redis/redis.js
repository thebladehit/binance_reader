const Redis = require('ioredis');
const { PAIR_STAT_COUNT } = require('../api-server/config/config');
const { STREAM_PREFIX } = require('../common/constants/constanse');
const redis = new Redis();

const readPairsPrice = (pairNames) => {
  const pipeline = redis.pipeline();
  for (const pairName of pairNames) {
    if (pairName.length === 0) {
      continue;
    }
    const streamKey = `${STREAM_PREFIX}:${pairName}`;
    pipeline.xrevrange(streamKey, '+', '-', 'COUNT', 1);
  }
  return pipeline.exec();
};

const readPairsPriceStat = async (pairName, timeInterval) => {
  const streamKey = `${STREAM_PREFIX}:${pairName}`;

  const latestEntry = await redis.xrevrange(streamKey, '+', '-', 'COUNT', 1);
  if (!latestEntry.length) {
    return [];
  }
  let [latestId] = latestEntry[0];
  let lastTime = parseInt(latestId.split('-')[0]);

  const pipeline = redis.pipeline();
  for (let i = 0; i < PAIR_STAT_COUNT; i++) {
    const timeId = `${lastTime - timeInterval * i}-0`;
    pipeline.xrange(streamKey, timeId, '+', 'COUNT', 1);
  }
  return pipeline.exec();
};

module.exports = { 
  readPairsPrice,
  readPairsPriceStat,
};