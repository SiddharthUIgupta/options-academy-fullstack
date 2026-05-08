const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { getTickerQuote, getOptionsChain } = require('../services/marketDataService');

const router = express.Router();
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Get options chain for a ticker
router.get('/options-chain', async (req, res) => {
  const { ticker } = req.query;
  try {
    const chain = await getOptionsChain(ticker);
    res.json(chain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user portfolio
router.get('/portfolio/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId },
      include: { trades: true }
    });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute a paper trade
router.post('/trade', async (req, res) => {
  const { symbol, optionSymbol, type, side, quantity, price } = req.body;
  const userId = 'local-user'; // Use the default local user
  
  try {
    const portfolio = await prisma.portfolio.findFirst({ where: { userId } });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    const cost = quantity * price * 100; // Options are typically 100 shares
    
    if (side.includes('BUY') && portfolio.balance < cost) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const trade = await prisma.trade.create({
      data: {
        portfolioId: portfolio.id,
        symbol,
        optionSymbol,
        type,
        side,
        quantity,
        price
      }
    });

    // Update balance (Paper money simulation)
    const newBalance = side.includes('BUY') ? portfolio.balance - cost : portfolio.balance + cost;
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { balance: newBalance }
    });

    res.json({ trade, newBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
