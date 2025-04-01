const fs = require('node:fs').promises;
const path = require('node:path');

const getPairsFromFile = (filePath) => {
  return fs.readFile(filePath);
}