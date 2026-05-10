const axios = require('axios');

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINNHUB_API_KEY;

const getTickerNews = async (ticker) => {
  try {
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const response = await axios.get(`${FINNHUB_BASE_URL}/company-news`, {
      params: {
        symbol: ticker,
        from,
        to,
        token: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.warn(`News API Error (${error.response?.status || error.message}). Switching to educational news placeholders.`);
    return [
      {
        id: 1,
        source: "Education Center",
        headline: `Understanding ${ticker} Market Dynamics`,
        summary: `As you explore ${ticker}, remember that options prices are influenced by implied volatility and time decay (Theta).`,
        url: "#"
      },
      {
        id: 2,
        source: "Market Wisdom",
        headline: "Why Diversification Matters in Options",
        summary: "Trading a single ticker like " + ticker + " carries specific risks. Learn to spread your paper money across different sectors.",
        url: "#"
      }
    ];
  }
};

module.exports = {
  getTickerNews
};
