const Redis = require('ioredis');
const { STREAM_PREFIX } = require('../../common/constants/constanse');

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

module.exports = { readPairsPrice };