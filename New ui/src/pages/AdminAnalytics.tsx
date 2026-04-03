import React from 'react';
import { 
  Filter, 
  Download, 
  TrendingDown, 
  TrendingUp, 
  MessageSquare,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FEEDBACK_ENTRIES } from '../constants';
import { cn } from '../lib/utils';

export const AdminAnalytics: React.FC = () => {
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
    <div className="p-10 space-y-10">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Kitchen Intelligence</h2>
          <p className="text-on-surface-variant font-medium">Deep dive into student preferences and consumption patterns.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all">
            <Filter size={18} />
            <span>Filter by Block</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            <Download size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Top Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Skipped Dishes */}
        <div className="bg-surface-container-low p-8 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-error">
              <TrendingDown size={20} />
            </div>
            <h3 className="text-xl font-headline font-extrabold text-primary">Most Skipped Dishes</h3>
          </div>
          <div className="space-y-6">
            {skippedDishes.map((dish) => (
              <div key={dish.name} className="flex items-center justify-between group">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-on-surface">{dish.name}</span>
                    <span className="text-xs font-black text-error">{dish.rate}% Skip Rate</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${dish.rate}%` }}
                      className="h-full bg-error rounded-full" 
                    />
                  </div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-2">Primary Reason: {dish.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Loved Dishes */}
        <div className="bg-surface-container-low p-8 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-headline font-extrabold text-primary">Most Loved Dishes</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {lovedDishes.map((dish) => (
              <div key={dish.name} className="bg-white p-5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{dish.tag}</span>
                  <span className="text-lg font-black text-primary">{dish.rate}%</span>
                </div>
                <h4 className="font-bold text-on-surface leading-tight">{dish.name}</h4>
                <div className="mt-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className={cn("w-1.5 h-1.5 rounded-full", s <= 4 ? "bg-primary" : "bg-surface-container-high")}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Feedback Feed */}
      <section className="bg-surface-container-lowest rounded-[2rem] shadow-[0px_24px_48px_rgba(27,28,25,0.04)] overflow-hidden border border-outline-variant/10">
        <div className="p-8 flex items-center justify-between border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-primary" size={24} />
            <h3 className="text-2xl font-headline font-extrabold text-primary">Live Feedback Feed</h3>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold uppercase">72% Positive</span>
            <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-[10px] font-bold uppercase">12% Negative</span>
          </div>
        </div>
        <div className="divide-y divide-outline-variant/10">
          {FEEDBACK_ENTRIES.map((entry) => (
            <div key={entry.id} className="p-8 flex gap-6 hover:bg-surface-container-low transition-colors">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                entry.sentiment === 'POS' ? "bg-primary-fixed text-primary" : "bg-error-container text-error"
              )}>
                {entry.sentiment === 'POS' ? <Smile size={24} /> : <Frown size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-on-surface">{entry.dish}</h4>
                  <span className="text-xs font-medium text-on-surface-variant">{entry.date} • {entry.block}</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed italic">"{entry.comment}"</p>
                <div className="mt-4 flex gap-4">
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Acknowledge</button>
                  <button className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest hover:underline">Flag for Review</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 text-center bg-surface-container-low/30">
          <button className="text-sm font-bold text-primary hover:underline underline-offset-4">Load More Feedback</button>
        </div>
      </section>
    </div>
  );
};
