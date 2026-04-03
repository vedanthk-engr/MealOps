"use client";

import React from 'react';
import AdminLayout from '@/components/admin/layout';
import { Users, ShoppingBasket, AlertTriangle, Star, TrendingUp, Download, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

const trendData = [
  { name: 'Mon', paneer: 3.5, butter: 3.8 },
  { name: 'Tue', paneer: 4.2, butter: 3.5 },
  { name: 'Wed', paneer: 3.8, butter: 3.2 },
  { name: 'Thu', paneer: 4.5, butter: 4.0 },
  { name: 'Fri', paneer: 4.0, butter: 3.8 },
  { name: 'Sat', paneer: 4.8, butter: 4.2 },
  { name: 'Sun', paneer: 4.6, butter: 4.5 },
];

const recommendations = [
  { name: 'Mutton Rogan Josh', orders: 420, rate: 94, recommended: 450, risk: 'Low' },
  { name: 'Seasonal Stir Fry', orders: 180, rate: 62, recommended: 210, risk: 'Medium' },
  { name: 'Curd Rice', orders: 510, rate: 48, recommended: 550, risk: 'High' },
  { name: 'Garlic Naan', orders: 680, rate: 88, recommended: 720, risk: 'Low' },
];

const stats = [
  { label: 'Students Logged Today', value: '1,284', trend: '+12%', icon: Users, color: 'text-primary', bg: 'bg-primary-fixed' },
  { label: 'Total Pre-Orders', value: '842', icon: ShoppingBasket, color: 'text-secondary', bg: 'bg-secondary-fixed' },
  { label: 'Predicted Wastage', value: '4.2', unit: 'kg', icon: AlertTriangle, color: 'text-error', bg: 'bg-error-container' },
  { label: 'Avg Satisfaction', value: '4.8', icon: Star, color: 'text-secondary', bg: 'bg-secondary-fixed', filled: true },
] as const;

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-12 space-y-24 pb-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <h1 className="text-8xl font-black text-on-surface tracking-tighter leading-[0.8]">Agrarian<br/>Command.</h1>
            <p className="text-sm font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 italic">Global Oversight of the Institutional Harvest</p>
          </div>
          <div className="flex bg-surface-container-low p-2 rounded-[2rem] shadow-sm">
             <button className="px-10 py-4 rounded-[1.5rem] bg-white text-primary text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/5">Real-time Feed</button>
             <button className="px-10 py-4 rounded-[1.5rem] text-on-surface-variant text-xs font-black uppercase tracking-widest hover:text-on-surface transition-all">Historical Archive</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
               key={stat.label} 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ delay: i * 0.1 }} 
               className="bg-surface-container-lowest p-10 rounded-[3rem] shadow-[0px_32px_64px_rgba(27,28,25,0.04)] border-0 flex flex-col justify-between min-h-[220px] group hover:scale-[1.02] transition-all duration-700 hover:shadow-2xl"
            >
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 opacity-50">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className={cn('text-6xl font-black tracking-tighter', stat.color)}>{stat.value}</h3>
                  {'unit' in stat && stat.unit ? <span className="text-xl font-black opacity-20 uppercase">{stat.unit}</span> : null}
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                {'trend' in stat && stat.trend ? (
                  <div className="flex items-center text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full">
                    <TrendingUp size={14} className="mr-2" />
                    {stat.trend} Trend
                  </div>
                ) : (
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg', stat.bg, stat.color)}>
                    <stat.icon size={24} fill={'filled' in stat && stat.filled ? 'currentColor' : 'none'} />
                  </div>
                )}
                <div className="h-1 w-12 bg-surface-container-high rounded-full opacity-20" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 bg-surface-container-lowest p-12 rounded-[3.5rem] shadow-[0px_32px_80px_rgba(27,28,25,0.06)] border-0">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h4 className="text-3xl font-black text-on-surface tracking-tighter">Resource<br/>Allocation.</h4>
                <p className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant opacity-40 mt-2">Lunch Protocol A</p>
              </div>
              <button className="p-4 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant">
                <MoreVertical size={24} />
              </button>
            </div>
            <div className="space-y-10">
              <AllocationBar label="Paneer Tikka" value={312} percent={85} />
              <AllocationBar label="Dal Tadka" value={245} percent={65} />
              <AllocationBar label="Mixed Veg Curry" value={168} percent={45} />
              <AllocationBar label="Butter Chicken" value={340} percent={92} />
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-container-lowest p-12 rounded-[3.5rem] shadow-[0px_32px_80px_rgba(27,28,25,0.06)] border-0 h-[520px] flex flex-col">
            <div className="flex justify-between items-baseline mb-12">
               <h4 className="text-3xl font-black text-on-surface tracking-tighter">Sentiment Flux.</h4>
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full bg-primary" />
                   <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Continental</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full bg-secondary" />
                   <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Regional</span>
                 </div>
               </div>
            </div>
            <div className="flex-1 w-full -ml-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="#f0eee9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#41493f', opacity: 0.3 }} dy={15} />
                  <YAxis hide />
                  <Tooltip 
                     contentStyle={{ borderRadius: '24px', border: 'none', background: '#ffffff', boxShadow: '0 32px 64px rgba(0,0,0,0.1)' }}
                     itemStyle={{ fontWeight: 900, color: '#104715' }}
                  />
                  <Line type="monotone" dataKey="paneer" stroke="#104715" strokeWidth={6} dot={false} strokeLinecap="round" />
                  <Line type="monotone" dataKey="butter" stroke="#feae2c" strokeWidth={6} dot={false} strokeLinecap="round" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <section className="bg-surface-container-lowest rounded-[4rem] shadow-[0px_48px_128px_rgba(27,28,25,0.08)] overflow-hidden border-0">
          <div className="p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h4 className="text-5xl font-black text-on-surface tracking-tighter leading-none mb-4">Cooking Directive.</h4>
              <p className="text-sm font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 italic">Forecast for Tomorrow's Institutional Intake</p>
            </div>
            <button className="bg-primary text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] flex items-center gap-4 hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/20 transition-all">
              <Download size={20} />
              <span>Export Ledger</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-0">
                  <th className="px-16 py-8 text-[10px] font-black text-on-surface tracking-[0.3em] uppercase">Dish Identification</th>
                  <th className="px-16 py-8 text-[10px] font-black text-on-surface tracking-[0.3em] uppercase text-center">Active Orders</th>
                  <th className="px-16 py-8 text-[10px] font-black text-on-surface tracking-[0.3em] uppercase">Utilization Rate</th>
                  <th className="px-16 py-8 text-[10px] font-black text-on-surface tracking-[0.3em] uppercase">Target QTY</th>
                  <th className="px-16 py-8 text-[10px] font-black text-on-surface tracking-[0.3em] uppercase text-right">Flux Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/30">
                {recommendations.map((rec) => (
                  <tr key={rec.name} className="hover:bg-surface-container-low/50 transition-all group">
                    <td className="px-16 py-10 font-black text-2xl tracking-tighter text-on-surface">{rec.name}</td>
                    <td className="px-16 py-10 text-center text-4xl font-black text-on-surface-variant opacity-30 group-hover:opacity-100 transition-opacity">{rec.orders}</td>
                    <td className="px-16 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-32 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full transition-all duration-1000', rec.rate > 80 ? 'bg-primary' : rec.rate > 50 ? 'bg-secondary' : 'bg-error')} style={{ width: `${rec.rate}%` }}></div>
                        </div>
                        <span className="text-xs font-black text-on-surface tracking-widest">{rec.rate}%</span>
                      </div>
                    </td>
                    <td className="px-16 py-10 font-black text-primary text-4xl tracking-tighter">{rec.recommended}</td>
                    <td className="px-16 py-10 text-right">
                      <span className={cn('px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm', rec.risk === 'Low' && 'bg-primary text-white', rec.risk === 'Medium' && 'bg-secondary text-on-surface', rec.risk === 'High' && 'bg-error text-white')}>
                        {rec.risk} Risk
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function AllocationBar({ label, value, percent }: { label: string; value: number; percent: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 text-xs font-bold text-on-surface-variant truncate">{label}</span>
      <div className="flex-1 h-8 bg-surface-container-highest rounded-lg overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="h-full bg-gradient-to-br from-primary to-primary-container" />
      </div>
      <span className="text-xs font-black text-primary">{value}</span>
    </div>
  );
}
