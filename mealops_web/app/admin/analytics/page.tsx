"use client";

import React from 'react';
import AdminLayout from '@/components/admin/layout';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { Calendar, Filter, Download, MessageSquareQuote, TrendingDown, Star, Frown, Meh, Smile, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const dummyWastage = [
  { day: 'Mon', wastage: 45, consumption: 800 },
  { day: 'Tue', wastage: 38, consumption: 780 },
  { day: 'Wed', wastage: 52, consumption: 650 },
  { day: 'Thu', wastage: 30, consumption: 820 },
  { day: 'Fri', wastage: 25, consumption: 900 },
  { day: 'Sat', wastage: 65, consumption: 550 },
  { day: 'Sun', wastage: 42, consumption: 720 },
];

const skippedDishes = [
  { name: 'Pumpkin Curry', skips: 145 },
  { name: 'Cabbage Stir Fry', skips: 120 },
  { name: 'Plain Daliya', skips: 95 },
  { name: 'Ragi Malt', skips: 88 },
  { name: 'Soya Chunks', skips: 76 },
];

export default function AnalyticsPage() {
  
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Analytics Header & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-10 rounded-[48px] shadow-sm border border-gray-50">
           <div className="flex items-center space-x-6">
              <div className="p-4 bg-gray-50 rounded-[24px] text-[#2A5F2A]"><Calendar size={32} /></div>
              <div>
                 <h1 className="text-3xl font-black text-gray-800 tracking-tighter">Mess Intelligence</h1>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Holistic usage and wastage audit portal</p>
              </div>
           </div>
           
           <div className="flex items-center space-x-4">
              <div className="flex bg-[#F5F3EE] p-1.5 rounded-2xl">
                 <button className="px-5 py-2.5 bg-white shadow-sm rounded-xl text-xs font-black text-[#2A5F2A]">LAST 30 DAYS</button>
                 <button className="px-5 py-2.5 rounded-xl text-xs font-black text-gray-400">CUSTOM RANGE</button>
              </div>
              <button className="flex items-center space-x-2 bg-[#2A5F2A] text-white px-6 py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-[#2A5F2A]/20 transition-transform hover:scale-105">
                 <Download size={16} />
                 <span>EXPORT ANALYTICS (.CSV)</span>
              </button>
           </div>
        </div>

        {/* Top Analytics Row: Wastage & Consumption */}
        <div className="bg-white rounded-[48px] p-12 shadow-sm border border-gray-100 relative group">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                 <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><TrendingDown size={24} /></div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Consumption Efficiency & Wastage Trend</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">KG Wasted vs Balanced Portions Delivered</p>
                 </div>
              </div>
              <div className="flex items-center space-x-8">
                 <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-full" /><span className="text-[10px] font-black text-gray-400 uppercase">Wastage (KG)</span></div>
                 <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#2A5F2A] rounded-full" /><span className="text-[10px] font-black text-gray-400 uppercase">Consumption (Portions)</span></div>
              </div>
           </div>
           
           <div className="h-96 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={dummyWastage}>
                    <defs>
                       <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2A5F2A" stopOpacity={0.1}/><stop offset="95%" stopColor="#2A5F2A" stopOpacity={0}/></linearGradient>
                       <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#EF4444" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#64748B' }} />
                    <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="consumption" stroke="#2A5F2A" strokeWidth={5} fillOpacity={1} fill="url(#colorCons)" />
                    <Area type="monotone" dataKey="wastage" stroke="#EF4444" strokeWidth={5} fillOpacity={1} fill="url(#colorWaste)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Bottom Insight Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           
           {/* Skipped Dishes Chart */}
           <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col items-center">
              <h3 className="text-xl font-bold text-gray-800 self-start mb-8 italic">Top 5 Disengagement Drivers</h3>
              <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skippedDishes} layout="vertical">
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#1A1A1A' }} width={120} />
                       <Tooltip cursor={{ fill: 'transparent' }} />
                       <Bar dataKey="skips" fill="#F87171" radius={[0, 10, 10, 0]} barSize={25}>
                          <LabelList dataKey="skips" position="right" style={{ fontSize: 11, fontWeight: 900, fill: '#EF4444' }} />
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Feedback Sentiment Block */}
           <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-gray-800">Student Sentiment Velocity</h3>
                 <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">LIVE FEEDBACK</span>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-4 no-scrollbar">
                 {[
                   { user: '21BCE0***', block: 'Block N', emoji: 'BAD', comment: 'The sambar was too watery today.', sentiment: 'NEGATIVE', score: 0.12 },
                   { user: '22BIT0***', block: 'Block Q', emoji: 'LOVED', comment: 'Best paneer lababdar I have ever had at VIT. Super creamy!', sentiment: 'POSITIVE', score: 0.98 },
                   { user: '21BML0***', block: 'Block L', emoji: 'OK', comment: 'Decent lunch, but Roti was a bit hard.', sentiment: 'NEUTRAL', score: 0.45 },
                   { user: '20BKT0***', block: 'Block D', emoji: 'MEH', comment: 'Need more variety in breakfast fruit options.', sentiment: 'NEGATIVE', score: 0.32 },
                 ].map((fb, k) => (
                    <div key={k} className="p-5 rounded-3xl bg-[#F5F3EE]/50 hover:bg-[#F5F3EE] transition-all border border-transparent hover:border-gray-100 group">
                       <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                             <div className={cn(
                               "p-2.5 rounded-xl",
                               fb.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-600' : (fb.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600')
                             )}>
                                {fb.sentiment === 'POSITIVE' ? <Smile size={20} /> : <Frown size={20} />}
                             </div>
                             <div>
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight leading-none mb-1">{fb.user} <span className="opacity-40 ml-1">• {fb.block}</span></h4>
                                <p className="text-xs font-bold text-gray-500 leading-relaxed italic">"{fb.comment}"</p>
                             </div>
                          </div>
                          <div className="p-2 bg-white rounded-lg shadow-sm font-black text-[9px] text-[#2A5F2A] group-hover:scale-110 transition-transform">
                             {Math.round(fb.score * 100)}% {fb.sentiment[0]}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </AdminLayout>
  );
}
