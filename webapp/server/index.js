require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const tutorialRoutes = require('./src/routes/tutorialRoutes');
const tradingRoutes = require('./src/routes/tradingRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const macroRoutes = require('./src/routes/macroRoutes');
const botRoutes = require('./src/routes/botRoutes');

app.use('/api/tutorials', tutorialRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/macro', macroRoutes);
app.use('/api/bot', botRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Options Learning API running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
