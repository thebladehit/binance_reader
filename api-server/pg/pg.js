const { Client } = require('pg');
const { PAIR_STAT_COUNT } = require('../config/config');

const client = new Client({
  host: '127.0.0.1',
  user: 'postgres', // your name
  password: '1111', // your pass
  database: 'binance_data'
});

client.connect();

const readPairPriceStat = async (pairName, interval) => {
  const queries = [];
  for (let i = 0; i < PAIR_STAT_COUNT; i++) {
    const end = Date.now() - interval * i;
    const start = end - interval;
    const sqlQuery = `
      SELECT * FROM trades_${pairName} WHERE timestamp BETWEEN $1 and $2 LIMIT 1;
    `;
    queries.push(client.query(sqlQuery, [start, end]));
  }
  return Promise.allSettled(queries);
};

module.exports = { readPairPriceStat };