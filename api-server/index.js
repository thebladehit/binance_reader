const express = require('express');
const { PORT } = require('./config/config');
const { getPairsPrice, getPairsPriceStats } = require('./handlers/handlers');

const app = express();

app.get('/price/:pairs', async (req, res) => {
  const pairs = req.params.pairs;
  const result = await getPairsPrice(pairs);
  res.status(200).json(result);
});

app.get('/price/:pairs/stats', async (req, res) => {
  const pairs = req.params.pairs;
  const timeInterval = req.query.interval || 3600 * 1000;
  const result = await getPairsPriceStats(pairs, timeInterval);
  res.status(200).json(result);
});

app.use((req, res) => {
  res.status(404).send('Not Found<br>Use /price/[pairNames]');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});