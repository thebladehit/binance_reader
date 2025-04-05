const { Client } = require('pg');
const { getPairNames } = require('../../common/parser/parser');
const { PAIRS_PATH } = require('../../common/constants/constanse');

const tableSQL = `
  CREATE TABLE IF NOT EXISTS trades_{{name}} (
    tradeId BIGINT,
    price VARCHAR(255),
    quantity VARCHAR(255),
    timestamp BIGINT
  );

  CREATE INDEX IF NOT EXISTS idx_timestamp ON trades_{{name}} (timestamp);
`;

const client = new Client({
  host: '127.0.0.1',
  user: 'postgres', // your name
  password: '1111', // your pass
  database: 'binance_data' // your db name
});

client.connect();

const createTables = async () => {
  let sqlQuery = '';

  const pairs = await getPairNames(PAIRS_PATH);
  for (const pair of pairs) {
    sqlQuery += tableSQL.replaceAll('{{name}}', pair) + '\n';
  }

  client.query(sqlQuery, (err, res) => {
    if (err) throw err;
    console.log('Table created successfuly');
    client.end();
  });
};

createTables();