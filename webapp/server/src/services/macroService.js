const axios = require('axios');

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';
const API_KEY = process.env.FRED_API_KEY;

const getSeriesData = async (seriesId, units = 'lin') => {
  try {
    const response = await axios.get(`${FRED_BASE_URL}/series/observations`, {
      params: {
        series_id: seriesId,
        api_key: API_KEY,
        file_type: 'json',
        sort_order: 'desc',
        units: units, // 'pc1' for percentage change from year ago
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
    // Interest Rate (Fed Funds Rate) is already a percentage
    const fedFunds = await getSeriesData('FEDFUNDS', 'lin');

    // Inflation (CPI) needs to be requested as percentage change from year ago
    const cpi = await getSeriesData('CPIAUCSL', 'pc1');

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
