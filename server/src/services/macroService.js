const axios = require('axios');

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';
const API_KEY = process.env.FRED_API_KEY;

const getSeriesData = async (seriesId) => {
  try {
    const response = await axios.get(`${FRED_BASE_URL}/series/observations`, {
      params: {
        series_id: seriesId,
        api_key: API_KEY,
        file_type: 'json',
        sort_order: 'desc',
        limit: 10
      }
    });
    return response.data.observations;
  } catch (error) {
    console.error(`Error fetching FRED series ${seriesId}:`, error.message);
    throw error;
  }
};

const getMacroStats = async () => {
  try {
    // Interest Rate (Fed Funds Rate)
    const fedFunds = await getSeriesData('FEDFUNDS');
    // Inflation (CPI)
    const cpi = await getSeriesData('CPIAUCSL');
    
    return {
      fedFunds,
      cpi
    };
  } catch (error) {
    console.error('Error fetching macro stats:', error.message);
    throw error;
  }
};

module.exports = {
  getSeriesData,
  getMacroStats
};
