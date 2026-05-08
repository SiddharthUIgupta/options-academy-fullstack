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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white mb-12 shadow-xl">
        <h1 className="text-5xl font-extrabold mb-4">Master Options Trading</h1>
        <p className="text-xl text-blue-100 max-w-2xl mb-8">
          The ultimate platform for learning options strategies with real-time data and zero financial risk. Start your paper trading journey today.
        </p>
        <div className="flex gap-4">
          <Link href="/tutorials" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
            Start Learning
          </Link>
          <Link href="/market" className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold border border-blue-400 hover:bg-blue-400 transition">
            Explore Markets
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard icon={<BookOpen size={24}/>} title="Lessons" value="12 Modules" color="text-blue-600" />
        <StatCard icon={<BarChart2 size={24}/>} title="Market Data" value="Real-time" color="text-green-600" />
        <StatCard icon={<Briefcase size={24}/>} title="Paper Money" value="$100,000" color="text-orange-600" />
        <StatCard icon={<Globe size={24}/>} title="API Integrations" value="Alpaca, Polygon, FRED" color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Why Options?</h2>
          <div className="space-y-4">
            <FeatureItem title="Leverage" description="Control large amounts of stock with a smaller investment." />
            <FeatureItem title="Hedging" description="Protect your portfolio from market downturns." />
            <FeatureItem title="Income Generation" description="Generate steady income through covered calls and puts." />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Globe className="text-gray-400" size={24} />
            Macro View
          </h2>
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Current Indicators</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1">FED FUNDS RATE</p>
                <p className="text-2xl font-bold text-gray-900">
                  {macro?.fedFunds?.[0]?.value ? `${macro.fedFunds[0].value}%` : 'Loading...'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1">INFLATION (CPI)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {macro?.cpi?.[0]?.value ? `${parseFloat(macro.cpi[0].value).toFixed(1)}%` : 'Loading...'}
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t text-xs text-gray-400 italic">
              Data provided by Federal Reserve Economic Data (FRED).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
      <div className={`${color} bg-gray-50 p-3 rounded-xl`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }: any) {
  return (
    <div className="p-6 bg-white border rounded-2xl hover:border-blue-500 transition-colors cursor-default group">
      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
