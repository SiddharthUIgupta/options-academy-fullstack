"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Search, TrendingUp, Newspaper, DollarSign } from 'lucide-react';

interface OptionContract {
  ticker: string;
  strike_price: number;
  expiration_date: string;
  contract_type: string;
}

interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  url: string;
  source: string;
}

export default function MarketView() {
  const [ticker, setTicker] = useState('');
  const [contracts, setContracts] = useState<OptionContract[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tradingContract, setTradingContract] = useState<OptionContract | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    
    setLoading(true);
    setError('');
    try {
      const [contractsRes, newsRes] = await Promise.all([
        axios.get(`http://localhost:3002/api/trading/options-chain?ticker=${ticker}`),
        axios.get(`http://localhost:3002/api/news/${ticker}`)
      ]);
      setContracts(contractsRes.data);
      setNews(newsRes.data);
    } catch (err: any) {
      setError('Failed to fetch data. Ensure your API keys are set in the backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async () => {
    if (!tradingContract) return;
    try {
      await axios.post('http://localhost:3002/api/trading/trade', {
        symbol: tradingContract.ticker,
        optionSymbol: `${tradingContract.ticker}-${tradingContract.strike_price}-${tradingContract.expiration_date}`,
        type: tradingContract.contract_type,
        side: 'BUY_OPEN',
        quantity: quantity,
        price: 2.50 // Mock price for now
      });
      alert('Trade executed successfully!');
      setTradingContract(null);
    } catch (err) {
      alert('Trade failed. Check backend balance.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Market Explorer</h1>
        <p className="text-gray-500 text-lg">Search tickers to view options chains and recent news.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Enter Ticker (e.g., TSLA, NVDA)"
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Searching...' : 'Explore'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-10">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Options Chain */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold">Options Chain</h2>
          </div>
          
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Strike</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Expiration</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contracts.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">${c.strike_price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${c.contract_type === 'call' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.contract_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{c.expiration_date}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setTradingContract(c)}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
                {contracts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">
                      No options data found for this ticker.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* News Feed */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Newspaper className="text-orange-500" size={24} />
            <h2 className="text-2xl font-bold">Latest News</h2>
          </div>
          <div className="space-y-6">
            {news.slice(0, 5).map((item) => (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group"
              >
                <p className="text-xs text-orange-600 font-semibold mb-1 uppercase tracking-wider">{item.source}</p>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition leading-tight mb-2">
                  {item.headline}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.summary}</p>
              </a>
            ))}
            {news.length === 0 && !loading && (
              <p className="text-gray-400 italic">No news found for this ticker.</p>
            )}
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {tradingContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-2">Execute Trade</h2>
            <p className="text-gray-500 mb-6 uppercase tracking-wider text-xs font-bold">
              {tradingContract.ticker} {tradingContract.strike_price} {tradingContract.contract_type} • {tradingContract.expiration_date}
            </p>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Quantity (Contracts)</label>
              <input 
                type="number" 
                min="1"
                className="w-full p-4 border-2 rounded-xl text-lg font-bold outline-none focus:border-blue-600 transition"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-400 mt-2">Cost: ${(quantity * 2.50 * 100).toLocaleString()}</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setTradingContract(null)}
                className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleTrade}
                className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Confirm BUY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
