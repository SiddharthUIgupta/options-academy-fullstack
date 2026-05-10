const axios = require('axios');

const POLYGON_BASE_URL = 'https://api.polygon.io';
const TIINGO_BASE_URL = 'https://api.tiingo.com/tiingo';
const API_KEY = process.env.POLYGON_API_KEY;
const TIINGO_API_KEY = process.env.TIINGO_API_KEY;

const getOptionsChain = async (ticker) => {
  try {
    // This is a simplified call to get the options chain
    // In reality, we'd need to fetch contracts and then their quotes/Greeks
    const response = await axios.get(`${POLYGON_BASE_URL}/v3/reference/options/contracts`, {
      params: {
        underlying_ticker: ticker,
        limit: 10,
        apiKey: API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching options chain:', error.message);
    throw error;
  }
};

const getTickerQuote = async (ticker) => {
  try {
    const response = await axios.get(`${POLYGON_BASE_URL}/v2/last/nbbo/${ticker}`, {
      params: {
        apiKey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.warn('Polygon error, trying Tiingo fallback:', error.message);
    try {
      const response = await axios.get(`${TIINGO_BASE_URL}/daily/${ticker}/prices`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${TIINGO_API_KEY}`
        }
      });
      return response.data[0];
    } catch (tiingoError) {
      console.error('Tiingo fallback error:', tiingoError.message);
      throw tiingoError;
    }
  }
};

module.exports = {
  getOptionsChain,
  getTickerQuote
};
