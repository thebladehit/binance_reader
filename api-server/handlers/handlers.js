const { readPairsPrice, readPairsPriceStat } = require("../redis/redis");

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

  const result = [];

  for (const pairName of pairNames) {
    const pairPriceStats = await readPairsPriceStat(pairName, timeInterval);
    const obj = { [pairName]: [] };
    let prevTradeId = 0;
    for (const priceStat of pairPriceStats) {
      if (priceStat[1]) {
        const data = JSON.parse(priceStat[1][0][1][0][1][1]);
        if (data.tradeId === prevTradeId) {
          break;
        }
        prevTradeId = data.tradeId;
        obj[pairName].push({
          ...data,
          date: new Date(data.timestamp).toISOString(),
        });
      }
    }
    result.push(obj);
  }

  return result;
};

module.exports = {
  getPairsPrice,
  getPairsPriceStats,
};