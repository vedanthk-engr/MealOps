"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Calendar, Wallet, TrendingUp, History, Download, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const dummyTrend = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, calories: Math.floor(Math.random() * (2600 - 1800 + 1) + 1800) }));
const dummyWeekly = [
  { day: 'Mon', protein: 85, carbs: 240, fat: 65 },
  { day: 'Tue', protein: 70, carbs: 310, fat: 50 },
  { day: 'Wed', protein: 95, carbs: 190, fat: 80 },
  { day: 'Thu', protein: 60, carbs: 220, fat: 75 },
  { day: 'Fri', protein: 110, carbs: 280, fat: 60 },
  { day: 'Sat', protein: 55, carbs: 400, fat: 45 },
  { day: 'Sun', protein: 80, carbs: 250, fat: 70 },
];

export default function NutritionHistoryPage() {
  const [period, setPeriod] = useState('Last 30 Days');

  const { data: history } = useQuery({
    queryKey: ['meal-history'],
    queryFn: async () => {
      const { data } = await api.get('/api/meals/history');
      return data;
    },
    initialData: []
  });

  const pieData = [
    { name: 'Protein', value: 30, color: '#2A5F2A' },
    { name: 'Carbs', value: 50, color: '#F5A623' },
    { name: 'Fat', value: 20, color: '#EA580C' },
  ];

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        
        {/* Top Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Donut Statistics Card */}
           <div className="lg:col-span-1 bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Today's Macro Balance</h3>
              <div className="w-full h-64 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                    <span className="text-3xl font-black text-gray-800 tracking-tighter">1,850</span>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Total KCAL</span>
                 </div>
              </div>
              <div className="w-full mt-6 space-y-3">
                 {pieData.map(p => (
                   <div key={p.name} className="flex items-center justify-between p-3 bg-[#F5F3EE] rounded-2xl">
                     <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                        <span className="text-xs font-bold text-gray-700">{p.name}</span>
                     </div>
                     <span className="text-xs font-black text-gray-500">{p.value}%</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Calorie Trend Card */}
           <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-xl font-black text-gray-800">Energy Consumption Trend</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Calorie stability over time</p>
                 </div>
                 <div className="bg-[#F5F3EE] p-1.5 rounded-2xl flex">
                    {['7 Days', '30 Days'].map(p => (
                       <button 
                         key={p} onClick={() => setPeriod(p)}
                         className={cn("px-4 py-2 rounded-xl text-[10px] font-black transition-all", period.includes(p.replace(' Days', '')) ? "bg-[#2A5F2A] text-white shadow-md" : "text-gray-400 hover:text-gray-600")}
                       >
                          {p}
                       </button>
                    ))}
                 </div>
              </div>
              <div className="flex-1 min-h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dummyTrend}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#CBD5E1' }} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#CBD5E1' }} />
                       <Tooltip 
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                          itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#2A5F2A' }}
                       />
                       <Line type="monotone" dataKey="calories" stroke="#2A5F2A" strokeWidth={4} dot={false} animationDuration={2000} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

        </div>

        {/* Macros Bar Chart */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                 <div className="p-3 bg-orange-50 rounded-2xl text-orange-600"><TrendingUp /></div>
                 <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Macro Nutrient History</h3>
              </div>
              <button className="flex items-center space-x-2 text-[10px] font-black uppercase text-[#2A5F2A] hover:bg-[#2A5F2A]/5 px-4 py-2 rounded-xl transition-all">
                 <Download size={16} />
                 <span>EXPORT LOGS</span>
              </button>
           </div>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={dummyWeekly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                    <Tooltip cursor={{ fill: '#F5F3EE' }} />
                    <Bar dataKey="protein" fill="#2A5F2A" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="carbs" fill="#F5A623" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="fat" fill="#EA580C" radius={[10, 10, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Detailed History Table */}
        <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100">
           <div className="p-8 border-b border-gray-50 flex items-center space-x-4">
              <History className="text-gray-300" />
              <h3 className="text-lg font-black text-gray-800">Complete Meal History</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-[#F5F3EE]/50">
                    <tr>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Date & Time</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Dish</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Intake</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Calories</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Feedback</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {history.length > 0 ? history.map((log: any, i: number) => (
                       <tr key={i} className="hover:bg-[#F5F3EE]/30 transition-colors cursor-pointer group">
                          <td className="px-8 py-6">
                             <div className="text-sm font-bold text-gray-800">{new Date(log.date).toLocaleDateString()}</div>
                             <div className="text-[10px] text-gray-400 font-medium">{log.mealType}</div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-100"><img src={log.dish?.imageUrl} className="w-full h-full object-cover rounded-xl" /></div>
                                <div className="text-sm font-black text-[#2A5F2A]">{log.dish?.name}</div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={cn(
                               "px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest",
                               log.status === 'ATE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                             )}>
                                {log.status}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="text-sm font-black text-gray-800">{log.dish?.calories} <span className="text-[10px] opacity-40">KCAL</span></div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center space-x-1">
                                {Array.from({ length: 4 }).map((_, j) => (
                                   <div key={j} className={cn("w-2 h-2 rounded-full", j < 3 ? "bg-[#F5A623]" : "bg-gray-100")} />
                                ))}
                             </div>
                          </td>
                       </tr>
                    )) : (
                       <tr><td colSpan={5} className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest">No detailed logs found. Start logging meals!</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </StudentLayout>
  );
}
