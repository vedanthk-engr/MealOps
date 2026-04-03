"use client";

import React from 'react';
import StudentLayout from '@/components/student/layout';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Flame, Droplet, Coffee, Utensils, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function StudentDashboard() {
  // 1. Fetch Today's Nutrition Summary
  const { data: nutritionSummary } = useQuery({
    queryKey: ['nutrition-summary-today'],
    queryFn: async () => {
      const { data } = await api.get('/api/meals/today');
      // Aggregate if needed, for now use a mock structure based on backend spec
      return {
        calories: 1850,
        protein: 65,
        carbs: 210,
        fat: 45,
        goals: { calories: 2500, protein: 90, carbs: 300, fat: 70 }
      };
    }
  });

  // 2. Fetch Today's Menu
  const { data: menu } = useQuery({
    queryKey: ['menu-today'],
    queryFn: async () => {
        const { data } = await api.get('/api/menu/today');
        return data;
    },
    initialData: { BREAKFAST: [], LUNCH: [], DINNER: [] }
  });

  const macros = [
    { label: 'Calories', val: nutritionSummary?.calories || 0, goal: nutritionSummary?.goals.calories, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Protein', val: nutritionSummary?.protein || 0, goal: nutritionSummary?.goals.protein, icon: Coffee, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Carbs', val: nutritionSummary?.carbs || 0, goal: nutritionSummary?.goals.carbs, icon: Droplet, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Fat', val: nutritionSummary?.fat || 0, goal: nutritionSummary?.goals.fat, icon: Utensils, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const ringData = [
     { name: 'Calories', value: ( (nutritionSummary?.calories || 0) / (nutritionSummary?.goals.calories || 1) ) * 100, fill: '#2A5F2A' }
  ];

  return (
    <StudentLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Main Feed */}
        <div className="lg:col-span-8 space-y-10">
           
           {/* Top Macros Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {macros.map((m, i) => (
                <motion.div 
                   key={m.label}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-default"
                >
                   <div className={`${m.bg} ${m.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                      <m.icon size={20} />
                   </div>
                   <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{m.label}</h3>
                   <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-xl font-bold">{m.val}</span>
                      <span className="text-[10px] text-gray-400">/ {m.goal}</span>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Today's Menu Section */}
           <div>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">Today's Selection</h2>
                 <Link href="/app/menu" className="text-[#2A5F2A] font-bold text-sm flex items-center hover:underline transition-all">
                    View Week Menu <ChevronRight size={16} />
                 </Link>
              </div>

              <div className="space-y-8">
                 {Object.entries(menu).map(([slot, dishes]: [string, any[]]) => (
                    <div key={slot}>
                       <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[3px] mb-4">{slot}</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dishes.length > 0 ? dishes.map((dish, i) => (
                             <motion.div 
                                key={dish.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-[#2A5F2A]/10"
                             >
                                <div className="flex p-4 space-x-4">
                                   <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                       <img src={dish.imageUrl || "/placeholder-dish.jpg"} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                       <div className={`absolute top-2 left-2 w-3 h-3 rounded-full border-2 border-white shadow-sm ${dish.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                   </div>
                                   <div className="flex-1 min-w-0 pr-4">
                                      <h4 className="font-bold text-gray-800 truncate text-lg">{dish.name}</h4>
                                      <div className="flex gap-2 mt-2">
                                         <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{dish.calories} kcal</span>
                                         <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{dish.protein}g P</span>
                                      </div>
                                      <div className="flex space-x-2 mt-4">
                                         <button className="flex-1 bg-[#2A5F2A]/10 text-[#2A5F2A] text-[10px] font-bold py-2 rounded-lg hover:bg-[#2A5F2A] hover:text-white transition-all">LOG MEAL</button>
                                         <button className="flex-1 bg-gray-100 text-gray-500 text-[10px] font-bold py-2 rounded-lg hover:bg-gray-200 transition-all">DETAILS</button>
                                      </div>
                                   </div>
                                </div>
                             </motion.div>
                          )) : (
                            <div className="col-span-2 py-8 px-8 bg-white/50 border border-dashed border-gray-300 rounded-3xl text-center text-gray-400">
                               No dishes scheduled for this slot.
                            </div>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Insights & Quick Actions */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Calorie Ring Card */}
           <div className="bg-[#2A5F2A] rounded-[40px] p-8 text-white shadow-xl shadow-[#2A5F2A]/30 overflow-hidden relative">
              <div className="relative z-10">
                 <h3 className="text-xl font-bold opacity-80">Daily Energy</h3>
                 <div className="h-60 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={ringData} startAngle={90} endAngle={450}>
                          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                          <RadialBar background dataKey="value" angleAxisId={0} cornerRadius={10} />
                       </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                       <span className="text-4xl font-black">{Math.round(ringData[0].value)}%</span>
                       <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Goal Met</span>
                    </div>
                 </div>
                 <div className="mt-4 flex items-center space-x-2 bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                    <div className="p-2 bg-white/20 rounded-lg">
                       <TrendingUp size={16} />
                    </div>
                    <p className="text-[11px] font-medium leading-tight">
                       You're on track to hit your calorie goal by dinner. Keep it up!
                    </p>
                 </div>
              </div>
              {/* Decorative backgrounds */}
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/5 rounded-full rotate-45" />
           </div>

           {/* Pre-Order Quick Panel */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-gray-800">Pre-Order: Tomorrow</h3>
                 <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg uppercase">Deadline: 9 PM</span>
              </div>
              <div className="space-y-4 mb-6">
                 {/* This would show simple small items to toggle */}
                 <div className="flex items-center justify-between p-3 bg-[#F5F3EE] rounded-xl">
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-lg bg-white overflow-hidden"><img src="/placeholder-dish.jpg" className="w-full h-full object-cover" /></div>
                       <span className="text-xs font-bold truncate max-w-[120px]">Mediterranean Bowl</span>
                    </div>
                    <button className="text-[9px] font-bold px-3 py-1 bg-white text-[#2A5F2A] rounded-lg shadow-sm">CHANGE</button>
                 </div>
              </div>
              <Link href="/app/preorder" className="w-full py-3.5 bg-[#F5A623] hover:bg-[#e0951b] text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all">
                 <Package size={16} />
                 <span>Manage Pre-Orders</span>
              </Link>
           </div>
        </div>

      </div>
    </StudentLayout>
  );
}

// Minimal Link component since I haven't setup next/link thoroughly yet
function Link({ href, children, className }: any) {
  return <a href={href} className={className}>{children}</a>;
}
