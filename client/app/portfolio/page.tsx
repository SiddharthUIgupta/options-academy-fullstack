"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Trade {
  id: string;
  symbol: string;
  optionSymbol?: string;
  type: string;
  side: string;
  quantity: number;
  price: number;
  timestamp: string;
}

interface Portfolio {
  balance: number;
  trades: Trade[];
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const dummyUserId = 'local-user'; // Matches setupLocal.js

  useEffect(() => {
    // In a real app, we'd get the actual userId from auth
    axios.get(`http://localhost:3002/api/trading/portfolio/${dummyUserId}`)
      .then(res => setPortfolio(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading portfolio...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Paper Trading Portfolio</h1>
      
      <div className="bg-blue-50 p-6 rounded-xl mb-10 border border-blue-100 flex justify-between items-center">
        <div>
          <p className="text-sm text-blue-600 font-medium uppercase tracking-wider">Total Cash Balance</p>
          <h2 className="text-4xl font-extrabold text-blue-900">${portfolio?.balance?.toLocaleString() ?? '100,000'}</h2>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Trade Now
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700">Recent Trades</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Symbol</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Side</th>
              <th className="px-6 py-3 font-medium">Qty</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {portfolio?.trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-900">{trade.optionSymbol || trade.symbol}</td>
                <td className="px-6 py-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium uppercase">{trade.type}</span></td>
                <td className="px-6 py-4"><span className={`${trade.side.includes('BUY') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded text-xs font-semibold uppercase tracking-tight`}>{trade.side}</span></td>
                <td className="px-6 py-4 text-gray-700 font-medium">{trade.quantity}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">${trade.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{new Date(trade.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!portfolio?.trades || portfolio.trades.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">No trades recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
