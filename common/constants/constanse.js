const path = require('node:path');

const PAIRS_PATH = path.resolve(__dirname, '..', 'assets', 'assets.txt');
const STREAM_PREFIX = 'binance';
const DELETION_PREFIX = 'not_updatable';

module.exports = {
  PAIRS_PATH,
  STREAM_PREFIX,
  DELETION_PREFIX,
}