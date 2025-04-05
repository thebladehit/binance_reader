const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  user: 'postgres', // your name
  password: '1111', // your pass
  database: 'binance_data'
});

client.connect();

const saveEntries = async (pairName, entries) => {
  const values = [];
  const params = [];

  for (let i = 0; i < entries.length; i++) {
    const entrie = entries[i];
    const idx = i * 4;
    const data = JSON.parse(entrie);
    values.push(`($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
    params.push(data.tradeId, data.price, data.quantity, data.timestamp);
  }
  
  const sqlQuery = `
    INSERT INTO trades_${pairName} (tradeId, price, quantity, timestamp)
    VALUES ${values.join(', ')}
  `;
  return client.query(sqlQuery, params);
};

const closePGConnection = () => {
  client.end();
};

module.exports = {
  closePGConnection,
  saveEntries,
};