"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { TrendingUp, Search } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  optionSymbol?: string;
  type: string;
  side: string;
  quantity: number;
  price: number;
  status: string; // Added status
  timestamp: string;
}

interface Portfolio {
  balance: number;
  trades: Trade[];
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState<string | null>(null); // Track which trade is closing
  const dummyUserId = 'local-user';

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`http://localhost:3002/api/trading/portfolio/${dummyUserId}`);
      setPortfolio(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleClosePosition = async (tradeId: string, currentPrice: number) => {
    if (closingId) return;
    setClosingId(tradeId);
    try {
      console.log('Closing trade:', tradeId, 'at price:', currentPrice);
      const response = await axios.post('http://localhost:3002/api/trading/close', {
        tradeId,
        currentPrice
      });
      console.log('Close response:', response.data);
      await fetchPortfolio();
      alert('Position closed successfully.');
    } catch (err) {
      console.error('Close error:', err);
      alert('Failed to close position. Check console for details.');
    } finally {
      setClosingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#86868b] font-medium animate-pulse text-lg">Accessing Secure Portfolio...</div>;

  const openPositions = portfolio?.trades.filter(t => t.status !== 'CLOSED') || [];
  const closedHistory = portfolio?.trades.filter(t => t.status === 'CLOSED') || [];

  return (
    <div className="p-8 max-w-[1100px] mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight text-[#1d1d1f]">Portfolio</h1>
          <p className="text-[17px] text-[#86868b] mt-1">Monitor your open positions and overall performance.</p>
        </div>
        <div className="bg-[#34c759]/10 text-[#34c759] px-4 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#34c759] rounded-full animate-pulse"></div>
          Live Paper Simulation
        </div>
      </div>
      
      <div className="bg-white border border-black/5 p-10 rounded-[32px] mb-12 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-[12px] text-[#86868b] font-bold uppercase tracking-widest mb-2">Paper Money Balance</p>
          <h2 className="text-[48px] font-bold text-[#1d1d1f] tracking-tight">
            ${portfolio?.balance?.toLocaleString() ?? '100,000'}
          </h2>
          <div className="flex gap-4 mt-6">
            <div className="bg-black/5 px-3 py-1.5 rounded-xl">
              <p className="text-[10px] text-[#86868b] font-bold uppercase mb-0.5">Open Value</p>
              <p className="text-[15px] font-bold text-[#1d1d1f]">${(openPositions.reduce((acc, curr) => acc + (curr.quantity * curr.price * 100), 0)).toLocaleString()}</p>
            </div>
            <div className="bg-black/5 px-3 py-1.5 rounded-xl">
              <p className="text-[10px] text-[#86868b] font-bold uppercase mb-0.5">Active Contracts</p>
              <p className="text-[15px] font-bold text-[#1d1d1f]">{openPositions.length}</p>
            </div>
          </div>
        </div>
        <Link href="/market" className="bg-[#007aff] text-white px-8 py-4 rounded-full text-[17px] font-semibold hover:bg-[#0071e3] transition shadow-lg shadow-[#007aff]/20">
          Make a Trade
        </Link>
      </div>

      {/* Open Positions */}
      <div className="mb-16">
        <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-6 flex items-center gap-2">
          Active Positions
          <span className="text-[13px] font-medium text-[#86868b] bg-black/5 px-2 py-0.5 rounded-full">{openPositions.length}</span>
        </h3>
        {openPositions.length === 0 ? (
          <div className="bg-white/50 border-2 border-dashed border-black/5 rounded-[32px] p-16 text-center">
            <p className="text-[#86868b]">No active positions. Your paper trades will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openPositions.map((trade) => {
              // Simulating current mark price as +/- a random amount for demonstration
              // In a production app, we would fetch live quotes for these symbols
              const currentPrice = trade.price * (1 + (Math.random() * 0.2 - 0.1));
              const pl = (currentPrice - trade.price) * trade.quantity * 100;
              const isProfit = pl >= 0;

              return (
                <div key={trade.id} className="bg-white border border-black/5 rounded-[28px] p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-bold text-[18px] text-[#1d1d1f]">{trade.optionSymbol || trade.symbol}</h4>
                      <p className="text-[11px] text-[#86868b] font-bold uppercase tracking-widest mt-0.5">{trade.symbol} • {trade.type.toUpperCase()}</p>
                    </div>
                    <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${isProfit ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#ff3b30]/10 text-[#ff3b30]'}`}>
                      {isProfit ? '+' : ''}${pl.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 bg-black/[0.02] rounded-2xl">
                      <p className="text-[10px] text-[#86868b] font-bold uppercase mb-1">Fill Price</p>
                      <p className="text-[15px] font-bold">${trade.price.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-black/[0.02] rounded-2xl">
                      <p className="text-[10px] text-[#86868b] font-bold uppercase mb-1">Market Price</p>
                      <p className="text-[15px] font-bold text-[#007aff]">${currentPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleClosePosition(trade.id, currentPrice)}
                    disabled={!!closingId}
                    className={`w-full py-4 rounded-[18px] text-[15px] font-bold transition-all ${
                      closingId === trade.id 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-[#1d1d1f] text-white hover:bg-black active:scale-[0.98]'
                    }`}
                  >
                    {closingId === trade.id ? 'Processing Order...' : 'Sell to Close'}
                  </button>
                  <p className="text-[11px] text-center text-[#86868b] mt-4 leading-relaxed italic">
                    Closing this position will sell the contracts back at the current market price and lock in your profit/loss.
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trade History */}
      {closedHistory.length > 0 && (
        <div>
          <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-6">Trade History</h3>
          <div className="bg-white border border-black/5 rounded-[28px] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-black/[0.02] text-[10px] text-[#86868b] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Contract</th>
                  <th className="px-8 py-5">Side</th>
                  <th className="px-8 py-5 text-center">Qty</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {closedHistory.map((trade) => (
                  <tr key={trade.id} className="opacity-60 grayscale-[0.5]">
                    <td className="px-8 py-6 font-bold text-[#1d1d1f] text-[14px]">{trade.optionSymbol || trade.symbol}</td>
                    <td className="px-8 py-6 text-[13px] font-semibold text-[#86868b] uppercase">{trade.side.replace(/_/g, ' ')}</td>
                    <td className="px-8 py-6 text-center text-[#1d1d1f] font-bold">{trade.quantity}</td>
                    <td className="px-8 py-6 text-[#1d1d1f] font-bold">${trade.price.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">Closed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
