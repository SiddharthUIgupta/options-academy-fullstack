"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, BarChart2, Briefcase, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [macro, setMacro] = useState<any>(null);

  useEffect(() => {
    axios.get('http://localhost:3002/api/macro/stats')
      .then(res => setMacro(res.data))
      .catch(err => console.error('Macro fetch error:', err));
  }, []);

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="text-center py-20 px-4">
        <h1 className="text-[56px] font-bold tracking-tight text-[#1d1d1f] leading-[1.1] mb-6">
          Master Options Trading.
        </h1>
        <p className="text-[24px] text-[#86868b] max-w-3xl mx-auto mb-10 font-medium">
          The ultimate platform for learning strategies with real-time data and zero financial risk.
        </p>
        <div className="flex justify-center gap-5">
          <Link href="/tutorials" className="bg-[#007aff] text-white px-8 py-4 rounded-full text-[17px] font-semibold hover:bg-[#0071e3] transition-all">
            Start Learning
          </Link>
          <Link href="/market" className="bg-black/5 text-[#007aff] px-8 py-4 rounded-full text-[17px] font-semibold hover:bg-black/10 transition-all">
            Explore Markets
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
        <StatCard icon={<BookOpen size={20}/>} title="Lessons" value="12 Modules" />
        <StatCard icon={<BarChart2 size={20}/>} title="Market Data" value="Real-time" />
        <StatCard icon={<Briefcase size={20}/>} title="Paper Money" value="$100,000" />
        <StatCard icon={<Globe size={20}/>} title="Data Source" value="FRED & Polygon" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
        <div>
          <h2 className="text-[32px] font-bold tracking-tight mb-8">Path to Mastery</h2>
          <div className="space-y-4">
            <StepItem 
              number="1" 
              title="Learn the Foundations" 
              description="Start with 'Market Mechanics' to understand how bulls, bears, and exchanges work."
              link="/tutorials/module-1/lesson-1"
              active={true}
            />
            <StepItem 
              number="2" 
              title="Master the Contract" 
              description="Understand the difference between a Call and a Put before you risk paper money."
              link="/tutorials/module-2/lesson-2"
            />
            <StepItem 
              number="3" 
              title="Consult the Teacher Bot" 
              description="Ask my automated advisor to find a safe setup and explain the Greeks for you."
              link="/bot"
            />
            <StepItem 
              number="4" 
              title="Execute a Paper Trade" 
              description="Confirm a trade suggested by the bot or find one yourself in the Market Explorer."
              link="/market"
            />
            <StepItem 
              number="5" 
              title="Track Your Portfolio" 
              description="See how time decay (Theta) and price moves affect your open positions."
              link="/portfolio"
            />
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-black/5 rounded-[32px] p-10 shadow-sm">
          <h2 className="text-[24px] font-bold mb-8 flex items-center gap-3">
            <Globe className="text-[#007aff]" size={24} />
            Live Market Context
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
            <div>
              <p className="text-[12px] text-[#86868b] font-bold uppercase tracking-widest mb-2">Fed Funds Rate</p>
              <p className="text-[40px] font-bold text-[#1d1d1f]">
                {macro?.fedFunds?.[0]?.value ? `${macro.fedFunds[0].value}%` : '—'}
              </p>
              <p className="text-[11px] text-[#86868b] mt-1 italic">The cost of borrowing money.</p>
            </div>
            <div>
              <p className="text-[12px] text-[#86868b] font-bold uppercase tracking-widest mb-2">CPI Inflation</p>
              <p className="text-[40px] font-bold text-[#1d1d1f]">
                {macro?.cpi?.[0]?.value ? `${parseFloat(macro.cpi[0].value).toFixed(1)}%` : '—'}
              </p>
              <p className="text-[11px] text-[#86868b] mt-1 italic">How fast prices are rising.</p>
            </div>
          </div>
          <div className="bg-[#007aff]/5 p-6 rounded-[20px] border border-[#007aff]/10">
            <h4 className="font-bold text-[#007aff] text-[15px] mb-2">Beginner Tip:</h4>
            <p className="text-[14px] text-[#1d1d1f]/70 leading-relaxed">
              When interest rates rise (Fed Funds), it often puts downward pressure on stock prices but can increase the "extrinsic value" of call options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, title, description, link, active }: any) {
  return (
    <Link href={link} className={`flex gap-6 p-6 rounded-[24px] transition-all border ${active ? 'bg-white border-black/5 shadow-sm' : 'border-transparent hover:bg-black/5'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${active ? 'bg-[#007aff] text-white' : 'bg-black/5 text-[#86868b]'}`}>
        {number}
      </div>
      <div>
        <h3 className="text-[17px] font-bold text-[#1d1d1f] mb-1">{title}</h3>
        <p className="text-[#86868b] text-[14px] leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}


function StatCard({ icon, title, value }: any) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-black/5 shadow-sm">
      <div className="bg-black/5 w-10 h-10 rounded-full flex items-center justify-center text-[#007aff] mb-4">
        {icon}
      </div>
      <p className="text-[13px] text-[#86868b] font-semibold tracking-tight uppercase mb-1">{title}</p>
      <p className="text-[20px] font-bold text-[#1d1d1f]">{value}</p>
    </div>
  );
}

function FeatureItem({ title, description }: any) {
  return (
    <div className="p-8 bg-white border border-black/5 rounded-[24px] hover:shadow-md transition-all duration-300 group">
      <h3 className="text-[19px] font-bold text-[#1d1d1f] mb-2">{title}</h3>
      <p className="text-[#86868b] text-[15px] leading-relaxed">{description}</p>
    </div>
  );
}
