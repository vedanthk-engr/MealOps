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
      <div className="px-4 lg:px-10 py-4 space-y-10">
        <div className="flex justify-between items-center">
          <div className="inline-flex bg-surface-container-low p-1.5 rounded-2xl">
            {['Today', 'Week', 'Month'].map((range) => (
              <button key={range} className={cn('px-6 py-2 rounded-xl text-sm font-bold transition-all', range === 'Week' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary')}>
                {range}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-primary font-bold">
            <Calendar size={18} />
            <span className="text-sm">October 24, 2026</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="CALORIES" value="1,840" goal="2,200" icon={Flame} color="text-primary" />
          <StatCard label="PROTEIN" value="124g" goal="150" icon={Dumbbell} color="text-secondary" />
          <StatCard label="CARBS" value="210g" goal="250" icon={Wheat} color="text-tertiary" />
          <StatCard label="FAT" value="52g" goal="65" icon={Droplets} color="text-tertiary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(27,28,25,0.06)]">
            <h4 className="font-headline font-extrabold text-xl text-primary mb-8">Daily Composition</h4>
            <div className="relative w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ name: 'Protein', value: 30 }, { name: 'Carbs', value: 45 }, { name: 'Fats', value: 25 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    <Cell fill="#104715" />
                    <Cell fill="#835500" />
                    <Cell fill="#68253f" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Intake</span>
                <span className="text-3xl font-headline font-extrabold text-primary">83%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(27,28,25,0.06)] min-h-[400px] flex flex-col">
            <h4 className="font-headline font-extrabold text-xl text-primary mb-10">Caloric Intake Trend</h4>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#104715" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#104715" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0eee9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#41493f' }} dy={10} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="actual" stroke="#104715" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                  <Area type="monotone" dataKey="target" stroke="#c1c9bb" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(27,28,25,0.06)]">
          <h4 className="font-headline font-extrabold text-xl text-primary mb-10">Macro Breakdown by Day</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#41493f' }} dy={10} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="protein" fill="#104715" radius={[4, 4, 0, 0]} />
                <Bar dataKey="carbs" fill="#835500" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fats" fill="#68253f" radius={[4, 4, 0, 0]} />
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
