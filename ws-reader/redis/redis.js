const Redis = require('ioredis');
const { STREAM_PREFIX } = require('../../common/constants/constanse');
const redis = new Redis();

const savePair = async (pairName, data) => {
  const streamKey = `${STREAM_PREFIX}:${pairName}`;
  redis.xadd(streamKey, '*', 'data', data);
}

module.exports = { savePair };