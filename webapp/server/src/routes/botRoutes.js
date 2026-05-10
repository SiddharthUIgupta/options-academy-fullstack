const express = require('express');
const router = express.Router();
const { suggestTrade } = require('../services/botService');

// Get a trade suggestion from the teacher bot
router.get('/suggest', async (req, res) => {
  const { intent } = req.query; // 'income' or 'directional'
  try {
    const suggestion = await suggestTrade(intent);
    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
