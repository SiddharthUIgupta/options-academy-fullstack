# Options Learning App

A full-stack application to learn options trading with paper money.

## Setup

### 1. Backend
1. Go to `webapp/server`.
2. Install dependencies: `npm install`.
3. Set up your `.env` file with API keys (Alpaca, Polygon, Finnhub, etc.).
4. Initialize the database: `npx prisma db push`.
5. Start the server: `node index.js`.

### 2. Frontend
1. Go to `webapp/client`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## Features
- **Tutorials:** Guided modules on options basics and advanced strategies.
- **Paper Trading:** Execute simulated options trades using Alpaca's logic and Polygon's data.
- **News Integration:** Stay informed with ticker-specific news from Finnhub/NewsAPI.
- **Portfolio Tracking:** Monitor your simulated balance and P&L.
