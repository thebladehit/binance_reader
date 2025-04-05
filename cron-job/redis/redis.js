const Redis = require('ioredis');

const redis = new Redis();

const renameStreamNames = (prefix, pairs) => {
  const pipeline = redis.pipeline();
  for (const pair of pairs) {
    console.log(pair)
    const oldKey = `${STREAM_PREFIX}:${pair}`;
    console.log(oldKey);
    const newKey = `${prefix}:${oldKey}`;
    pipeline.renamenx(oldKey, newKey);
  }
  return pipeline.exec();
}

const readData = (streamKey, readCount) => {
  return redis.xrange(streamKey, '-', '+', 'COUNT', readCount);
};

const deleteData = (streamKey, entriesIds) => {
  return redis.xdel(streamKey, ...entriesIds);
}

const deleteStream = (streamKey) => {
  return redis.del(streamKey);
};

const closeRedisConnection = () => {
  redis.quit();
};

module.exports = {
  renameStreamNames,
  closeRedisConnection,
  readData,
  deleteData,
  deleteStream,
};