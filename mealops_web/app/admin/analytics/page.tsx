"use client";

import React from 'react';
import AdminLayout from '@/components/admin/layout';
import { Filter, Download, TrendingDown, TrendingUp, MessageSquare, Smile, Frown } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEEDBACK_ENTRIES } from '@/lib/new-ui-data';
import { cn } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const skippedDishes = [
    { name: 'Steamed Tapioca', rate: 65, reason: 'Texture Issues' },
    { name: 'Bitter Gourd Fry', rate: 58, reason: 'Taste Preference' },
    { name: 'Upma', rate: 42, reason: 'Repetitive' },
    { name: 'Cabbage Poriyal', rate: 35, reason: 'Bland' },
  ];

  const lovedDishes = [
    { name: 'Butter Chicken', rate: 95, tag: 'High Protein' },
    { name: 'Paneer Tikka', rate: 92, tag: 'Vegetarian' },
    { name: 'Masala Dosa', rate: 88, tag: 'Breakfast' },
    { name: 'Gulab Jamun', rate: 85, tag: 'Dessert' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12 space-y-24 pb-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <h2 className="text-8xl font-black text-on-surface tracking-tighter leading-[0.8]">Culinary<br/>Intelligence.</h2>
            <p className="text-sm font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 italic">Deep deconstruction of institutional flavor sentiment.</p>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-[2rem] shadow-sm">
            <button className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/5">
              <Filter size={18} />
              <span>Block Protocol</span>
            </button>
            <button className="flex items-center gap-2 px-8 py-4 text-on-surface-variant hover:text-on-surface rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all">
              <Download size={18} />
              <span>Full Archive</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-surface-container-lowest p-12 rounded-[3.5rem] shadow-[0px_32px_64px_rgba(27,28,25,0.04)] border-0">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-[1.5rem] bg-error text-white flex items-center justify-center shadow-xl shadow-error/20">
                <TrendingDown size={32} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-on-surface tracking-tighter leading-none">Rejected Harvests.</h3>
                 <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mt-2">Critical Taste Deviations</p>
              </div>
            </div>
            <div className="space-y-10">
              {skippedDishes.map((dish) => (
                <div key={dish.name} className="flex items-center justify-between group">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-black text-on-surface tracking-tight leading-none">{dish.name}</span>
                      <span className="text-xs font-black text-error uppercase tracking-widest">{dish.rate}% Refusal</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${dish.rate}%` }} className="h-full bg-error rounded-full" />
                    </div>
                    <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-4 opacity-40">Primary Anomaly: {dish.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-12 rounded-[3.5rem] shadow-[0px_32px_64px_rgba(27,28,25,0.04)] border-0">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20">
                <TrendingUp size={32} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-on-surface tracking-tighter leading-none">Optimal Selections.</h3>
                 <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mt-2">Peak Satisfaction Velocity</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {lovedDishes.map((dish) => (
                <div key={dish.name} className="bg-surface-container-low p-8 rounded-[2.5rem] border-0 shadow-sm hover:scale-105 transition-all duration-700 hover:shadow-xl group">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">{dish.tag}</span>
                    <span className="text-2xl font-black text-primary tracking-tighter">{dish.rate}%</span>
                  </div>
                  <h4 className="text-lg font-black text-on-surface tracking-tight leading-tight">{dish.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="bg-surface-container-lowest rounded-[4rem] shadow-[0px_48px_128px_rgba(27,28,25,0.08)] overflow-hidden border-0">
          <div className="p-16 flex flex-col md:flex-row items-center justify-between gap-10 bg-surface-container-low/50">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-primary/10 text-primary rounded-[2rem]"><MessageSquare size={36} /></div>
              <div>
                <h3 className="text-4xl font-black text-on-surface tracking-tighter leading-none">Live Sentiment Stream.</h3>
                <p className="text-sm font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 italic mt-2">Real-time Qualitative Deconstruction</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="px-6 py-3 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">72% Positive Flow</span>
              <span className="px-6 py-3 rounded-full bg-error text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-error/20">12% Dissent</span>
            </div>
          </div>
          <div className="divide-y divide-surface-container-high/30">
            {FEEDBACK_ENTRIES.map((entry) => (
              <div key={entry.id} className="p-12 flex gap-10 hover:bg-surface-container-low/50 transition-all group">
                <div className={cn('w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-xl transition-transform group-hover:scale-110 duration-700', entry.sentiment === 'POS' ? 'bg-primary text-white shadow-primary/20' : 'bg-error text-white shadow-error/20')}>
                  {entry.sentiment === 'POS' ? <Smile size={32} /> : <Frown size={32} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-black text-on-surface tracking-tighter">{entry.dish}</h4>
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-30">{entry.date} • {entry.block} Block</span>
                  </div>
                  <p className="text-lg font-medium text-on-surface-variant leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{entry.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
