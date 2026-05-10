const express = require('express');
const { getMacroStats } = require('../services/macroService');

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const stats = await getMacroStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
