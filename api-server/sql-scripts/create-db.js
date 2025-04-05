const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  host: '127.0.0.1',
  user: 'postgres', // your name
  password: '1111', // your pass
  database: 'binance_data'
});

client.connect();

const sql = fs.readFileSync('./db.sql', 'utf8');

client.query(sql, (err, res) => {
  if (err) throw err;
  console.log('Table created successfuly');
  client.end();
});
