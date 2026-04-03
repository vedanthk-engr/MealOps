"use client";

import React from 'react';
import StudentLayout from '@/components/student/layout';
import { Flame, Dumbbell, Wheat, Droplets, Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const trendData = [
  { name: 'Mon', actual: 1600, target: 2200 },
  { name: 'Tue', actual: 1800, target: 2200 },
  { name: 'Wed', actual: 1700, target: 2200 },
  { name: 'Thu', actual: 2000, target: 2200 },
  { name: 'Fri', actual: 1900, target: 2200 },
  { name: 'Sat', actual: 2100, target: 2200 },
  { name: 'Sun', actual: 1840, target: 2200 },
];

const macroData = [
  { name: 'Mon', protein: 120, carbs: 160, fats: 90 },
  { name: 'Tue', protein: 140, carbs: 150, fats: 80 },
  { name: 'Wed', protein: 110, carbs: 180, fats: 100 },
  { name: 'Thu', protein: 130, carbs: 140, fats: 70 },
  { name: 'Fri', protein: 150, carbs: 170, fats: 110 },
  { name: 'Sat', protein: 100, carbs: 120, fats: 60 },
  { name: 'Sun', protein: 145, carbs: 130, fats: 85 },
];

export default function NutritionPage() {
  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 space-y-20 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <h2 className="text-8xl font-black text-on-surface tracking-tighter leading-[0.8] mb-6">Metabolic<br/>Portrait.</h2>
            <p className="text-sm font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 italic">Statistical Insight into your Harvest intake</p>
          </div>
          <div className="flex bg-surface-container-low p-2 rounded-[2rem] shadow-sm">
            {['Today', 'Week', 'Month'].map((range) => (
              <button 
                key={range} 
                className={cn(
                  'px-10 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all', 
                  range === 'Week' ? 'bg-white text-primary shadow-xl shadow-primary/5 scale-105' : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard label="ENERGY" value="1,840" goal="2,200 KCAL" icon={Flame} color="text-primary" />
          <StatCard label="PROTEIN" value="124g" goal="150g" icon={Dumbbell} color="text-secondary" />
          <StatCard label="CARBS" value="210g" goal="250g" icon={Wheat} color="text-primary-container" />
          <StatCard label="LIPIDS" value="52g" goal="65g" icon={Droplets} color="text-tertiary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 bg-surface-container-lowest p-12 rounded-[3rem] shadow-[0px_32px_64px_rgba(27,28,25,0.05)] border-0">
            <h4 className="text-2xl font-black text-on-surface tracking-tighter mb-10">Macro Profile.</h4>
            <div className="relative w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={[{ name: 'Protein', value: 30 }, { name: 'Carbs', value: 45 }, { name: 'Fats', value: 25 }]} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={90} 
                    outerRadius={120} 
                    paddingAngle={3} 
                    dataKey="value"
                  >
                    <Cell fill="#104715" stroke="none" />
                    <Cell fill="#feae2c" stroke="none" />
                    <Cell fill="#68253f" stroke="none" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-black text-on-surface tracking-tighter">83<span className="text-2xl opacity-20">%</span></span>
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-2">Optimal Balance</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-container-lowest p-12 rounded-[3rem] shadow-[0px_32px_64px_rgba(27,28,25,0.05)] border-0 h-[480px] flex flex-col">
            <div className="flex justify-between items-baseline mb-12">
               <h4 className="text-2xl font-black text-on-surface tracking-tighter">Energy Flux Trends.</h4>
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-primary" />
                 <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Actual Intake</span>
               </div>
            </div>
            <div className="flex-1 w-full -ml-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#104715" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#104715" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f0eee9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#41493f', opacity: 0.4 }} dy={15} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', background: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} 
                    itemStyle={{ fontWeight: 900, color: '#104715' }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#104715" strokeWidth={5} fillOpacity={1} fill="url(#colorActual)" />
                  <Area type="monotone" dataKey="target" stroke="#feae2c" strokeWidth={2} strokeDasharray="8 8" fill="none" opacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-12 rounded-[3rem] shadow-[0px_32px_64px_rgba(27,28,25,0.05)] border-0">
          <h4 className="text-2xl font-black text-on-surface tracking-tighter mb-12">Chronological Breakdowns.</h4>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroData} barGap={8}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#41493f', opacity: 0.4 }} dy={15} />
                <YAxis hide />
                <Tooltip 
                   cursor={{ fill: '#f5f3ee', radius: 24 }}
                   contentStyle={{ borderRadius: '24px', border: 'none', background: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} 
                />
                <Bar dataKey="protein" fill="#104715" radius={[12, 12, 12, 12]} />
                <Bar dataKey="carbs" fill="#feae2c" radius={[12, 12, 12, 12]} />
                <Bar dataKey="fats" fill="#68253f" radius={[12, 12, 12, 12]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function StatCard({ label, value, goal, icon: Icon, color }: { label: string; value: string; goal: string; icon: React.ComponentType<{ size?: number }>; color: string }) {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const numericGoal = parseFloat(goal.replace(/[^0-9.]/g, ''));
  const percentage = Math.min((numericValue / numericGoal) * 100, 100);

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(27,28,25,0.04)] flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-start">
        <span className="text-on-surface-variant font-bold text-sm tracking-tight">{label}</span>
        <div className={cn('p-2 rounded-lg', color.replace('text-', 'bg-').concat('/10'), color)}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className={cn('text-4xl font-headline font-extrabold tracking-tighter', color)}>{value}</h3>
        <p className="text-xs text-on-surface-variant mt-1 font-semibold">Goal: {goal}</p>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className={cn('h-full rounded-full', color.replace('text-', 'bg-'))} />
        </div>
      </div>
    </div>
  );
}
