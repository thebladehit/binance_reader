const { readPairPriceStat } = require("../pg/pg");
const { readPairsPrice } = require("../redis/redis");

const getPairsPrice = async (pairs) => {
  const pairNames = pairs.split(',');

  const result = [];
  const pairPrices = await readPairsPrice(pairNames);

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

  return result;
};

const getPairsPriceStats = async (pairs, timeInterval) => {
  const pairNames = pairs.split(',');

  const result = pairNames.map(async (pairName) => {
    const obj = { [pairName]: [] };
    try {
      const pairPriceStats = await readPairPriceStat(pairName, timeInterval);
      for (const priceStat of pairPriceStats.rows) {
        obj[pairName].push(priceStat);
      }
    } catch (err) {
      obj[pairName] = 'no data on this pair';
    } finally {
      return obj;
    }
  });

  return Promise.all(result);
};

module.exports = {
  getPairsPrice,
  getPairsPriceStats,
};