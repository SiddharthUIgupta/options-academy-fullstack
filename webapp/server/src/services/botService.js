const { getMarketMovers, getOptionsChain } = require('./marketDataService');

/**
 * Smart Teacher Bot Service
 * Analyzes market data to suggest and explain trades.
 */

const suggestTrade = async (intent = 'income') => {
  try {
    const movers = await getMarketMovers();
    // Filter for stable large-cap stocks for a "safe" teacher suggestion
    const candidates = movers.filter(m => ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD'].includes(m.symbol));
    
    if (intent === 'income') {
      console.log('Bot is scanning for the best Covered Call...');
      let bestTrade = null;
      let highestYield = -1;

      // Scan all candidates to find the mathematically "best" covered call yield
      for (const target of candidates) {
        const chain = await getOptionsChain(target.symbol);
        const currentPrice = target.price;

        // Find OTM calls (strike > current price)
        const otmCalls = chain.filter(c => c.contract_type === 'call' && c.strike_price > currentPrice * 1.02); // At least 2% OTM

        for (const call of otmCalls) {
          // Calculate Return on Capital (ROC) / Yield
          // E.g. Premium is $2.00, Stock is $100 -> Yield is 2%
          const tradeYield = (call.ask / currentPrice) * 100;
          
          if (tradeYield > highestYield) {
            highestYield = tradeYield;
            bestTrade = {
              target,
              contract: call,
              yield: tradeYield.toFixed(2)
            };
          }
        }
      }

      // If for some reason we couldn't find one, fallback to a basic one
      if (!bestTrade) {
        const target = candidates[0];
        const chain = await getOptionsChain(target.symbol);
        bestTrade = {
          target,
          contract: chain.find(c => c.contract_type === 'call' && c.strike_price > target.price) || chain[0],
          yield: "2.00"
        };
      }

      const totalPremium = (bestTrade.contract.ask * 100).toFixed(2);
      const stockCost = (bestTrade.target.price * 100).toLocaleString();

      return {
        ticker: bestTrade.target.symbol,
        currentPrice: bestTrade.target.price,
        strategy: "Covered Call (Income Strategy)",
        contract: bestTrade.contract,
        teacherNote: {
          headline: `I scanned the market and found a ${bestTrade.yield}% instant yield on ${bestTrade.target.symbol}.`,
          reasoning: `I looked at major tech stocks and evaluated their premiums. ${bestTrade.target.symbol} offers the best Return on Capital right now. The stock is at $${bestTrade.target.price.toFixed(2)}, and by selling the $${bestTrade.contract.strike_price} Call, you immediately collect $${totalPremium} in cash.`,
          lesson: `**The Math:** You buy 100 shares of ${bestTrade.target.symbol} for $${stockCost}. You sell the call option and get paid $${totalPremium}. That is an instant ${bestTrade.yield}% return on your money (${totalPremium} / ${stockCost}). As long as the stock stays below $${bestTrade.contract.strike_price} by expiration, you keep the stock AND the premium!`,
          risk: `You must own 100 shares of ${bestTrade.target.symbol} to do this safely. If the stock drops significantly, your shares lose value, though the $${totalPremium} premium helps cushion the fall.`
        }
      };
    }

    // Directional logic remains similar, picking a random candidate
    const target = candidates[Math.floor(Math.random() * candidates.length)] || movers[0];
    const chain = await getOptionsChain(target.symbol);

    return {
      ticker: target.symbol,
      currentPrice: target.price,
      strategy: "Bullish Call Buy",
      contract: chain.find(c => c.contract_type === 'call' && c.strike_price > target.price) || chain[0],
      teacherNote: {
        headline: `Time for a directional momentum play on ${target.symbol}.`,
        reasoning: `The stock is showing activity at $${target.price.toFixed(2)}. Buying the $${(chain.find(c => c.contract_type === 'call' && c.strike_price > target.price) || chain[0]).strike_price} call gives you high leverage for a fraction of the cost of buying 100 shares.`,
        lesson: "When you BUY a call, you are paying the premium to control 100 shares. You need the stock to move UP quickly to beat the daily 'time decay' (Theta) working against you.",
        risk: "If the stock stays flat or goes down, your option contract will lose value every day and could expire worthless."
      }
    };

  } catch (error) {
    console.error('Bot Service Error:', error);
    throw error;
  }
};

module.exports = { suggestTrade };
