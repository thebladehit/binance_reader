const express = require('express');
const { PORT } = require('./config/config');
const { readPairsPrice } = require('./redis/redis');

const app = express();

app.get('/price/:pairs', async (req, res) => {
  const pairNames = req.params.pairs.split(',');
  const pairPrices = await readPairsPrice(pairNames);
  const result = [];

  for (let i = 0; i < pairNames.length; i++) {
    const pairName = pairNames[i];
    const pairPrice = pairPrices[i];
    if (pairPrice[1].length === 0) {
      result.push({ [pairName]: 'no data on this pair' });
    } else {
      result.push({
        [pairName]: JSON.parse(pairPrice[1][0][1][1]).price,
      })
    }
  }
  res.status(200).json(result);
});

app.use((req, res) => {
  res.status(404).send('Not Found<br>Use /price/[pairNames]');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});