"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, TrendingUp, Newspaper, Globe, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface OptionContract {
  ticker: string;
  strike_price: number;
  expiration_date: string;
  contract_type: string;
  bid: number;
  ask: number;
  mark: number;
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
  const [movers, setMovers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tradingContract, setTradingContract] = useState<OptionContract | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Initial load for trending data (Yahoo Finance style empty state)
    axios.get('http://localhost:3002/api/trading/movers').then(res => setMovers(res.data)).catch(() => {});
    axios.get('http://localhost:3002/api/trading/trending-news').then(res => setNews(res.data)).catch(() => {});
  }, []);

  const handleSearch = async (e: React.FormEvent, manualTicker?: string) => {
    if (e) e.preventDefault();
    const searchTicker = manualTicker || ticker;
    if (!searchTicker) return;
    
    setLoading(true);
    setError('');
    try {
      const [contractsRes, newsRes, historyRes] = await Promise.all([
        axios.get(`http://localhost:3002/api/trading/options-chain?ticker=${searchTicker}`),
        axios.get(`http://localhost:3002/api/news/${searchTicker}`),
        axios.get(`http://localhost:3002/api/trading/history/${searchTicker}`)
      ]);
      setContracts(contractsRes.data);
      setNews(newsRes.data);
      setHistory(historyRes.data);
      setTicker(searchTicker);
    } catch (err: any) {
      setError('Service connection required for live data.');
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
        optionSymbol: tradingContract.ticker.includes(':') ? tradingContract.ticker : `O:${tradingContract.ticker}${tradingContract.expiration_date.replace(/-/g, '').slice(2)}${tradingContract.contract_type === 'call' ? 'C' : 'P'}${(tradingContract.strike_price * 1000).toString().padStart(8, '0')}`,
        type: tradingContract.contract_type,
        side: 'BUY_OPEN',
        quantity: quantity,
        price: tradingContract.ask
      });
      alert('Paper trade executed successfully.');
      setTradingContract(null);
    } catch (err) {
      alert('Trade execution error.');
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-[40px] font-bold tracking-tight text-[#1d1d1f] mb-4">Market Explorer</h1>
        <p className="text-[19px] text-[#86868b] mb-10">Real-time options monitoring and paper trading execution.</p>
        
        <form onSubmit={(e) => handleSearch(e)} className="relative group mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#86868b]" size={20} />
          <input
            type="text"
            placeholder="Search Ticker (AAPL, TSLA...)"
            className="w-full pl-14 pr-6 py-5 bg-white border border-black/5 rounded-[20px] text-[17px] outline-none focus:ring-4 focus:ring-[#007aff]/10 transition-all shadow-sm"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#007aff] text-white px-6 py-2.5 rounded-[14px] font-semibold hover:bg-[#0071e3] transition disabled:bg-gray-200"
          >
            {loading ? '...' : 'Explore'}
          </button>
        </form>

        <div className="bg-[#007aff]/5 p-6 rounded-[24px] border border-[#007aff]/10 text-left flex items-start gap-4">
          <div className="bg-[#007aff] text-white p-2 rounded-lg shrink-0">
            <Globe size={20} />
          </div>
          <div>
            <h4 className="font-bold text-[#007aff] text-[15px] mb-1">New to this?</h4>
            <p className="text-[14px] text-[#1d1d1f]/70 leading-relaxed">
              Think of the <strong>Options Chain</strong> as a menu. You're looking at different contracts for {ticker || 'a stock'}. The <strong>Strike Price</strong> is the target price, and the <strong>Ask</strong> is what you pay today using your paper money.
            </p>
          </div>
        </div>
      </div>

      {/* Trending Tickers Board */}
      <div className="mb-12">
        <h3 className="text-[13px] font-bold text-[#86868b] uppercase tracking-widest mb-6">Trending Tickers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movers.length > 0 ? movers.map((m) => (
            <button 
              key={m.symbol}
              onClick={() => handleSearch(null as any, m.symbol)}
              className="bg-white border border-black/5 p-5 rounded-[24px] hover:shadow-md transition-all text-left group"
            >
              <p className="font-bold text-[17px] text-[#1d1d1f] group-hover:text-[#007aff]">{m.symbol}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[13px] text-[#86868b]">${m.price.toFixed(2)}</p>
                <p className={`text-[12px] font-bold ${parseFloat(m.change) >= 0 ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
                  {parseFloat(m.change) >= 0 ? '+' : ''}{m.change}%
                </p>
              </div>
            </button>
          )) : (
            [1,2,3,4,5,6].map(i => <div key={i} className="bg-white/50 border border-black/5 p-5 rounded-[24px] h-[80px] animate-pulse" />)
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Price Chart */}
          {history.length > 0 && contracts.length > 0 && (
            <div className="bg-white border border-black/5 rounded-[32px] p-8 mb-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[12px] text-[#86868b] font-bold uppercase tracking-widest mb-1">{ticker} PERFORMANCE</p>
                  <h3 className="text-[28px] font-bold text-[#1d1d1f]">Market Overview</h3>
                </div>
                <div className="text-right">
                  <p className="text-[24px] font-bold text-[#1d1d1f]">${history[history.length - 1].price.toFixed(2)}</p>
                  <p className="text-[12px] text-[#34c759] font-bold">+2.45% Today</p>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007aff" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#007aff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      hide={true}
                    />
                    <YAxis 
                      hide={true} 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: '12px' }}
                      itemStyle={{ fontWeight: 'bold', color: '#007aff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#007aff" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#007aff]/10 flex items-center justify-center text-[#007aff]">
              <TrendingUp size={18} />
            </div>
            <h2 className="text-[22px] font-bold">{contracts.length > 0 ? `${ticker} Options Chain` : 'Select a Ticker'}</h2>
          </div>
          
          {contracts.length > 0 ? (
            <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-[28px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-black/[0.02] text-[11px] text-[#86868b] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Strike</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Exp</th>
                    <th className="px-8 py-5">Ask</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {contracts.map((c, i) => (
                    <tr key={i} className="hover:bg-black/[0.01] transition-colors">
                      <td className="px-8 py-6 font-bold text-[#1d1d1f]">${c.strike_price}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[12px] font-bold px-2 py-1 rounded-md ${c.contract_type === 'call' ? 'text-[#34c759] bg-[#34c759]/10' : 'text-[#ff3b30] bg-[#ff3b30]/10'}`}>
                          {c.contract_type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[14px] text-[#86868b]">{c.expiration_date}</td>
                      <td className="px-8 py-6 font-bold text-[#007aff]">${c.ask?.toFixed(2)}</td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setTradingContract(c)}
                          className="text-[14px] font-bold text-[#007aff] hover:bg-[#007aff]/5 px-4 py-2 rounded-full transition"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white/50 border-2 border-dashed border-black/5 rounded-[32px] p-24 text-center">
              <div className="bg-black/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-[#86868b]">
                <Search size={32} />
              </div>
              <p className="text-[#86868b] font-medium italic">Enter a ticker symbol or select a trending stock to view its options chain.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#ff9500]/10 flex items-center justify-center text-[#ff9500]">
              <Newspaper size={18} />
            </div>
            <h2 className="text-[22px] font-bold">{contracts.length > 0 ? `${ticker} Intelligence` : 'Market Top Stories'}</h2>
          </div>
          <div className="space-y-4">
            {news.length > 0 ? news.slice(0, 5).map((item) => (
              <a key={item.id} href={item.url} target="_blank" className="block bg-white border border-black/5 p-6 rounded-[24px] hover:shadow-md transition group">
                <p className="text-[10px] text-[#ff9500] font-bold uppercase tracking-widest mb-2">{item.source || 'Market News'}</p>
                <h3 className="font-bold text-[16px] leading-tight text-[#1d1d1f] group-hover:text-[#007aff] transition mb-3">
                  {item.headline}
                </h3>
                <p className="text-[13px] text-[#86868b] line-clamp-2 leading-relaxed">{item.summary}</p>
              </a>
            ) ) : (
              [1,2,3].map(i => <div key={i} className="bg-white/50 border border-black/5 p-6 rounded-[24px] h-[120px] animate-pulse" />)
            )}
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {tradingContract && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300 border border-white/20">
            <div className="text-center mb-8">
              <span className="bg-black/5 text-[#86868b] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Paper Order</span>
              <h2 className="text-[28px] font-bold text-[#1d1d1f]">Confirm Execution</h2>
              <p className="text-[15px] text-[#86868b] mt-2">
                {tradingContract.ticker} • {tradingContract.strike_price} {tradingContract.contract_type}
              </p>
            </div>
            
            <div className="bg-black/5 rounded-[24px] p-6 mb-8 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-[10px] text-[#86868b] font-bold uppercase mb-1">Contract Price</p>
                <p className="text-[22px] font-bold text-[#1d1d1f]">${tradingContract.ask?.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-[#86868b] font-bold uppercase mb-1">Total Cost</p>
                <p className="text-[22px] font-bold text-[#007aff]">${(quantity * tradingContract.ask * 100).toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-[13px] font-bold text-[#86868b] mb-3 uppercase text-center">Quantity</label>
              <input 
                type="number" 
                min="1"
                className="w-full bg-white border border-black/5 p-4 rounded-[18px] text-[20px] font-bold text-center outline-none focus:ring-4 focus:ring-[#007aff]/10 transition"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleTrade}
                className="w-full bg-[#007aff] text-white py-5 rounded-[20px] text-[17px] font-bold hover:bg-[#0071e3] transition shadow-lg shadow-[#007aff]/20"
              >
                Execute Buy Order
              </button>
              <button 
                onClick={() => setTradingContract(null)}
                className="w-full py-4 text-[#86868b] text-[15px] font-semibold hover:text-[#1d1d1f] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
