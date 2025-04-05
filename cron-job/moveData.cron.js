const { getPairNames } = require('../common/parser/parser');
const { PAIRS_PATH, DELETION_PREFIX, STREAM_PREFIX } = require('../common/constants/constanse');
const { closeRedisConnection, renameStreamNames, readData, deleteData, deleteStream } = require('./redis/redis');
const { READ_COUNT_FROM_ONE_PAIR, READ_MAX_COUNT } = require('./config/config');
const { saveEntries, closePGConnection } = require('./pg/pg');

const start = async () => {
  const pairs = await getPairNames(PAIRS_PATH);
  const movedCount = await moveDataToDb(pairs, `${DELETION_PREFIX}:${STREAM_PREFIX}`);
  if (movedCount === 0) {
    await renameStreamNames(DELETION_PREFIX, pairs);
  }
  
  closeRedisConnection();
  closePGConnection();
};
  
const moveDataToDb = async (pairs, prefix) => {
  let counter = 0;
  const savePromises = [];
  const delPromises = [];
  
  for (const pair of pairs) {
    const streamKey = `${prefix}:${pair}`;
    const readCount = Math.min(READ_MAX_COUNT - counter, READ_COUNT_FROM_ONE_PAIR);
    const entries = await readData(streamKey, readCount);
    counter += entries.length;

    if (entries.length === 0) {
      deleteStream(streamKey);
      continue;
    }

    const entriesIds = entries.map(([id]) => id);
    const entriesData = entries.map(([_, [__, data]]) => data);

    console.log(pair, entriesData.length, new Date().toISOString()); // debug

    savePromises.push(saveEntries(pair, entriesData));
    delPromises.push(deleteData(streamKey, entriesIds));

    if (counter === READ_MAX_COUNT) {
      break;
    }
  }

  await Promise.all(savePromises);
  await Promise.all(delPromises);

  return counter;
};

start();