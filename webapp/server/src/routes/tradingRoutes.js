const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { getTickerQuote, getOptionsChain, getMarketMovers, getTrendingNews, getPriceHistory } = require('../services/marketDataService');

const router = express.Router();
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Get price history for chart
router.get('/history/:ticker', async (req, res) => {
  const { ticker } = req.params;
  try {
    const history = await getPriceHistory(ticker);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get market movers
router.get('/movers', async (req, res) => {
  try {
    const movers = await getMarketMovers();
    res.json(movers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending news
router.get('/trending-news', async (req, res) => {
  try {
    const news = await getTrendingNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
        price,
        status: 'OPEN'
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

// Close a paper trade (Sell to close)
router.post('/close', async (req, res) => {
  const { tradeId, currentPrice } = req.body;
  
  try {
    const trade = await prisma.trade.findUnique({
      where: { id: tradeId },
      include: { portfolio: true }
    });

    if (!trade) return res.status(404).json({ error: 'Trade not found' });
    if (trade.status === 'CLOSED') return res.status(400).json({ error: 'Trade already closed' });

    const proceeds = trade.quantity * currentPrice * 100;

    // Update trade status
    await prisma.trade.update({
      where: { id: tradeId },
      data: { status: 'CLOSED' }
    });

    // Update portfolio balance
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: trade.portfolioId },
      data: { balance: trade.portfolio.balance + proceeds }
    });

    res.json({ status: 'success', newBalance: updatedPortfolio.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
