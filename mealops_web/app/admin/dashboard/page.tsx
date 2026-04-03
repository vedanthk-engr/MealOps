"use client";

import React from 'react';
import AdminLayout from '@/components/admin/layout';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, ClipboardCheck, Scale, Heart, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const dummyStats = [
  { label: 'Total Students Logged', val: '2,480', sub: '82% of total', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: 4.2 },
  { label: 'Pre-Orders Tomorrow', val: '1,920', sub: '95% response', icon: ClipboardCheck, color: 'text-purple-600', bg: 'bg-purple-50', trend: 1.5 },
  { label: 'Predicted Wastage', val: '42.5 KG', sub: 'Critical reduction', icon: Scale, color: 'text-red-600', bg: 'bg-red-50', trend: -12.4 },
  { label: 'Avg Satisfaction', val: '8.4', sub: 'Based on 1.2k reviews', icon: Heart, color: 'text-orange-600', bg: 'bg-orange-50', trend: 0.8 },
];

const preorderData = [
  { dish: 'Butter Chicken', count: 450 },
  { dish: 'Paneer Makhani', count: 380 },
  { dish: 'Dal Tadka', count: 290 },
  { dish: 'Jeera Rice', count: 520 },
  { dish: 'Med. Salad', count: 180 },
];

export default function AdminDashboard() {
  const { data: dashboardData, refetch, isFetching } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/dashboard');
      return data;
    },
    refetchInterval: 30000 // Real-time update every 30s as requested
  });

  return (
    <AdminLayout>
      <div className="space-y-10">
        
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {dummyStats.map((stat, i) => (
              <motion.div 
                 key={stat.label}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                 <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}><stat.icon size={20} /></div>
                    {stat.trend && (
                      <div className={`flex items-center space-x-1 text-[10px] font-black rounded-lg px-2 py-1 ${stat.trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                         {stat.trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                         <span>{Math.abs(stat.trend)}%</span>
                      </div>
                    )}
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tighter leading-none mb-1">{stat.val}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                    <p className="text-[10px] text-[#888888] font-medium mt-2">{stat.sub}</p>
                 </div>
              </motion.div>
           ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Dishes Pre-Orders Bar Chart */}
           <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Dish Popularity (Pre-Orders)</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Tomorrow Forecast</p>
                 </div>
                 <button onClick={() => refetch()} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                    <RefreshCw size={18} className={cn("text-gray-400", isFetching && "animate-spin")} />
                 </button>
              </div>
              <div className="h-72 w-full relative z-10">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={preorderData} layout="vertical">
                       <XAxis type="number" hide />
                       <YAxis dataKey="dish" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} width={100} />
                       <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                       <Bar dataKey="count" fill="#2A5F2A" radius={[0, 10, 10, 0]} barSize={25} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-all"><Utensils size={200} /></div>
           </div>

           {/* Satisfaction Score Line Chart */}
           <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col group">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Sentiment Velocity</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Satisfaction Score (Last 7 Days)</p>
                 </div>
              </div>
              <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                       { day: 'Mon', score: 8.2 }, { day: 'Tue', score: 7.8 }, { day: 'Wed', score: 8.5 }, { day: 'Thu', score: 9.1 }, { day: 'Fri', score: 8.7 }, { day: 'Sat', score: 8.3 }, { day: 'Sun', score: 8.9 }
                    ]}>
                       <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#2A5F2A" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#2A5F2A" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} />
                       <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                       <Area type="monotone" dataKey="score" stroke="#2A5F2A" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

        </div>

        {/* Action Required: Wastage Prediction Table */}
        <div className="bg-white rounded-[48px] overflow-hidden shadow-sm border border-gray-100">
           <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><AlertTriangle size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase">Operational Wastage Alerts</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mt-1 italic">Immediate production adjustments recommended</p>
                 </div>
              </div>
              <button className="px-6 py-3 bg-gray-100 rounded-2xl text-[10px] font-black uppercase text-gray-500 hover:bg-gray-200 transition-all">View All Alerts</button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-[#F5F3EE]/50">
                    <tr>
                       <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Target Dish</th>
                       <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Pre-Orders</th>
                       <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Historic Eat %</th>
                       <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Procurement Target</th>
                       <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Risk Severity</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {[
                      { dish: 'Special Paneer Pulav', count: 680, rate: '92%', target: '740 Portions', risk: 'LOW', riskColor: 'bg-green-100 text-green-700' },
                      { dish: 'Malai Kofta (Heavy)', count: 420, rate: '74%', target: '560 Portions', risk: 'MEDIUM', riskColor: 'bg-orange-100 text-orange-700' },
                      { dish: 'Vegetable Upma', count: 310, rate: '58%', target: '530 Portions', risk: 'HIGH', riskColor: 'bg-red-100 text-red-700' },
                      { dish: 'Coconut Burfi', count: 850, rate: '98%', target: '860 Portions', risk: 'MINIMAL', riskColor: 'bg-blue-100 text-blue-700' },
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-[#F5F3EE]/20 transition-colors group cursor-default">
                         <td className="px-10 py-8">
                            <span className="text-sm font-black text-[#2A5F2A] uppercase tracking-tight leading-none">{row.dish}</span>
                         </td>
                         <td className="px-10 py-8">
                            <span className="text-sm font-bold text-gray-800">{row.count} <span className="text-xs text-gray-400">req</span></span>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex items-center space-x-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                               <span className="text-sm font-bold text-gray-800">{row.rate}</span>
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <span className="text-sm font-black text-gray-800 bg-gray-100 px-4 py-2 rounded-xl">{row.target}</span>
                         </td>
                         <td className="px-10 py-8">
                             <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", row.riskColor)}>
                                {row.risk}
                             </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </AdminLayout>
  );
}
