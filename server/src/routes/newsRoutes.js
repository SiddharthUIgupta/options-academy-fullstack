const express = require('express');
const { getTickerNews } = require('../services/newsService');

const router = express.Router();

router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  try {
    const news = await getTickerNews(ticker);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
