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
  const sqlQuery = [];
  const params = [];

  for (let i = 0; i < PAIR_STAT_COUNT; i++) {
    const end = Date.now() - interval * i;
    const start = end - interval;
    const idx = i * 2;
    sqlQuery.push(`(SELECT * FROM trades_${pairName} WHERE timestamp BETWEEN $${idx + 1} and $${idx + 2} LIMIT 1)`);
    params.push(start, end);
  }
  return client.query(sqlQuery.join(' UNION ALL '), params);
};

module.exports = { readPairPriceStat };