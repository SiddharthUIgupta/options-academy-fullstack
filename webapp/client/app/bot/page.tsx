"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, GraduationCap, ArrowRight, Wallet, Target, Info, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BotAdvisorPage() {
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);

  const getSuggestion = async (intent: string) => {
    setLoading(true);
    setSuggestion(null);
    try {
      const res = await axios.get(`http://localhost:3002/api/bot/suggest?intent=${intent}`);
      setSuggestion(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!suggestion) return;
    setExecuting(true);
    try {
      await axios.post('http://localhost:3002/api/trading/trade', {
        symbol: suggestion.ticker,
        optionSymbol: suggestion.contract.ticker.includes(':') ? suggestion.contract.ticker : `O:${suggestion.ticker}${suggestion.contract.expiration_date.replace(/-/g, '').slice(2)}${suggestion.contract.contract_type === 'call' ? 'C' : 'P'}${(suggestion.contract.strike_price * 1000).toString().padStart(8, '0')}`,
        type: suggestion.contract.contract_type,
        side: suggestion.strategy.includes('Covered') ? 'SELL_OPEN' : 'BUY_OPEN',
        quantity: 1,
        price: suggestion.contract.ask
      });
      alert(`Teacher Bot has executed the ${suggestion.ticker} trade for you! Check your portfolio.`);
      setSuggestion(null);
    } catch (err) {
      alert('Execution failed. Check backend balance.');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto">
      <div className="text-center mb-16">
        <div className="bg-[#007aff]/10 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-[#007aff]">
          <GraduationCap size={40} />
        </div>
        <h1 className="text-[48px] font-bold tracking-tight text-[#1d1d1f] mb-4">Smart Teacher Bot</h1>
        <p className="text-[20px] text-[#86868b] max-w-2xl mx-auto">
          "Hello! I'm your automated advisor. Tell me your goal, and I'll find a trade and explain exactly why it makes sense."
        </p>
      </div>

      {!suggestion ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <button 
            onClick={() => getSuggestion('income')}
            disabled={loading}
            className="group bg-white border border-black/5 p-10 rounded-[40px] text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="bg-[#34c759]/10 w-14 h-14 rounded-2xl flex items-center justify-center text-[#34c759] mb-6 group-hover:bg-[#34c759] group-hover:text-white transition-colors">
              <Wallet size={28} />
            </div>
            <h3 className="text-[24px] font-bold text-[#1d1d1f] mb-2">Generate Income</h3>
            <p className="text-[#86868b] leading-relaxed mb-8">
              I'll find a stable stock and suggest a <strong>Covered Call</strong> or <strong>Put</strong> to collect immediate paper cash.
            </p>
            <div className="flex items-center gap-2 text-[#007aff] font-bold">
              Scan Markets <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          <button 
            onClick={() => getSuggestion('directional')}
            disabled={loading}
            className="group bg-white border border-black/5 p-10 rounded-[40px] text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="bg-[#007aff]/10 w-14 h-14 rounded-2xl flex items-center justify-center text-[#007aff] mb-6 group-hover:bg-[#007aff] group-hover:text-white transition-colors">
              <Target size={28} />
            </div>
            <h3 className="text-[24px] font-bold text-[#1d1d1f] mb-2">Directional Growth</h3>
            <p className="text-[#86868b] leading-relaxed mb-8">
              I'll look for stocks with high momentum and suggest a <strong>Bullish Call</strong> to leverage a price move.
            </p>
            <div className="flex items-center gap-2 text-[#007aff] font-bold">
              Find Momentum <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Bot Suggestion Result */}
          <div className="bg-white border border-black/5 rounded-[48px] overflow-hidden shadow-2xl mb-12">
            <div className="bg-gray-900 p-10 text-white flex justify-between items-center">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#86868b] mb-2">Recommended Setup</p>
                <h2 className="text-[32px] font-bold">{suggestion.ticker} {suggestion.strategy}</h2>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#86868b] mb-2">Market Price</p>
                <p className="text-[32px] font-bold text-[#34c759]">${suggestion.currentPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <section>
                    <h4 className="flex items-center gap-2 text-[18px] font-bold text-[#1d1d1f] mb-4">
                      <GraduationCap className="text-[#007aff]" size={22} />
                      Teacher's Reasoning
                    </h4>
                    <p className="text-[17px] text-[#1d1d1f] font-semibold mb-3">{suggestion.teacherNote.headline}</p>
                    <p className="text-[16px] text-[#86868b] leading-relaxed italic border-l-4 border-[#007aff] pl-6 py-1">
                      "{suggestion.teacherNote.reasoning}"
                    </p>
                  </section>

                  <section>
                    <h4 className="flex items-center gap-2 text-[18px] font-bold text-[#1d1d1f] mb-4">
                      <Info className="text-[#007aff]" size={22} />
                      Today's Lesson
                    </h4>
                    <p className="text-[16px] text-[#86868b] leading-relaxed">
                      {suggestion.teacherNote.lesson}
                    </p>
                  </section>

                  <section className="bg-[#ff3b30]/5 p-6 rounded-[24px] border border-[#ff3b30]/10">
                    <h4 className="flex items-center gap-2 text-[15px] font-bold text-[#ff3b30] mb-2 uppercase tracking-wide">
                      <AlertCircle size={18} />
                      The Risk
                    </h4>
                    <p className="text-[14px] text-[#1d1d1f]/80 leading-relaxed font-medium">
                      {suggestion.teacherNote.risk}
                    </p>
                  </section>
                </div>

                <div className="bg-black/[0.02] rounded-[32px] p-8 border border-black/5">
                  <h4 className="text-[14px] font-bold text-[#86868b] uppercase tracking-widest mb-6">Contract Details</h4>
                  <div className="space-y-6">
                    <DetailRow label="Option Strike" value={`$${suggestion.contract.strike_price}`} />
                    <DetailRow label="Expiration" value={suggestion.contract.expiration_date} />
                    <DetailRow label="Ask Price" value={`$${suggestion.contract.ask.toFixed(2)}`} />
                    <DetailRow label="Probability" value="~70% (Simulated)" />
                    <div className="pt-6 mt-6 border-t border-black/5">
                      <DetailRow label="Total Paper Cost" value={`$${(suggestion.contract.ask * 100).toLocaleString()}`} highlight />
                    </div>
                  </div>

                  <div className="mt-10 space-y-4">
                    <button 
                      onClick={handleExecute}
                      disabled={executing}
                      className="w-full bg-[#007aff] text-white py-5 rounded-[24px] text-[18px] font-bold hover:bg-[#0071e3] transition shadow-xl shadow-[#007aff]/20 flex items-center justify-center gap-3"
                    >
                      {executing ? 'Executing Order...' : 'Yes, Let\'s Do It'}
                      {!executing && <ArrowRight size={20} />}
                    </button>
                    <button 
                      onClick={() => setSuggestion(null)}
                      className="w-full py-4 text-[#86868b] text-[15px] font-bold hover:text-[#1d1d1f] transition"
                    >
                      Wait, explain something else
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-20 animate-pulse">
          <div className="bg-black/5 w-12 h-12 rounded-full mx-auto mb-4" />
          <p className="text-[#86868b] font-medium">Scanning Markets for the Best Teacher Opportunity...</p>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-[14px] text-[#86868b] font-medium">{label}</p>
      <p className={`text-[17px] font-bold ${highlight ? 'text-[#007aff]' : 'text-[#1d1d1f]'}`}>{value}</p>
    </div>
  );
}
