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
    console.error('Error fetching news:', error.message);
    throw error;
  }
};

module.exports = {
  getTickerNews
};
