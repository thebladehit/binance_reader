const fs = require('node:fs').promises;

const getPairNamesWithTradeStream = async (filePath, tradeStreamType) => {
  const data = await fs.readFile(filePath, 'utf-8');
  return data
    .split('\n')
    .map((pair) => (pair.split('/').join('')).toLowerCase().replace(/\u200B/g, '') + tradeStreamType);
};

const getPairNames = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf-8');
  return data
    .split('\n')
    .map((pair) => (pair.split('/').join('')).toLowerCase());
};

module.exports = { 
  getPairNamesWithTradeStream,
  getPairNames,
};