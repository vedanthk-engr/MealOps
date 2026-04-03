"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Leaf, Waves, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function MenuPage() {
  const [selectedDay, setSelectedDay] = useState('MON');
  const [expandedSlots, setExpandedSlots] = useState<string[]>(['BREAKFAST', 'LUNCH', 'DINNER']);

  const { data: menu, isLoading } = useQuery({
    queryKey: ['menu-week'],
    queryFn: async () => {
      const { data } = await api.get('/api/menu/week');
      return data;
    },
  });

  const toggleSlot = (slot: string) => {
    setExpandedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);
  };

  const dayData = menu?.[`2026-04-0${days.indexOf(selectedDay) + 6}`] || { BREAKFAST: [], LUNCH: [], DINNER: [] }; // Mock indexing

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Day Selector */}
        <div className="bg-white p-2 rounded-2xl flex items-center justify-between shadow-sm sticky top-24 z-30 overflow-x-auto no-scrollbar">
           {days.map((day) => (
             <button
               key={day}
               onClick={() => setSelectedDay(day)}
               className={cn(
                  "px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap",
                  selectedDay === day ? "bg-[#2A5F2A] text-white shadow-md" : "text-gray-400 hover:text-gray-600"
               )}
             >
               {day}
             </button>
           ))}
        </div>

        {/* Meal Sections */}
        <div className="space-y-6">
           {['BREAKFAST', 'LUNCH', 'DINNER'].map((slot) => (
              <div key={slot} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                 <button 
                   onClick={() => toggleSlot(slot)}
                   className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                 >
                    <div className="flex items-center space-x-4">
                       <div className="w-1.5 h-6 bg-[#2A5F2A] rounded-full" />
                       <h3 className="text-xl font-black text-gray-800 tracking-tight">{slot}</h3>
                       <span className="bg-[#2A5F2A]/10 text-[#2A5F2A] text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {dayData[slot]?.length || 0} ITEMS
                       </span>
                    </div>
                    <motion.div animate={{ rotate: expandedSlots.includes(slot) ? 180 : 0 }}>
                       <ChevronDown size={24} className="text-gray-300" />
                    </motion.div>
                 </button>

                 <AnimatePresence>
                    {expandedSlots.includes(slot) && (
                       <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                       >
                          <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                             {dayData[slot]?.length > 0 ? dayData[slot].map((dish: any) => (
                                <div key={dish.id} className="bg-[#F5F3EE] rounded-3xl p-6 flex flex-col hover:shadow-md transition-all">
                                   <div className="flex space-x-6">
                                      <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-inner bg-gray-200">
                                         <img src={dish.imageUrl || "/placeholder-dish.jpg"} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex-1 space-y-3">
                                         <div className="flex items-start justify-between">
                                            <h4 className="text-lg font-bold text-gray-800 leading-tight">{dish.name}</h4>
                                            {dish.isVeg ? <Leaf className="text-green-500" size={18} /> : <Waves className="text-blue-500" size={18} />}
                                         </div>
                                         <p className="text-xs text-gray-400 line-clamp-2">{dish.description || "A nutritious mess classic prepared fresh by our head chef."}</p>
                                         <div className="flex flex-wrap gap-2">
                                            <span className="text-[10px] bg-white text-gray-500 font-bold px-2 py-1 rounded-lg">🔥 {dish.calories} kcal</span>
                                            <span className="text-[10px] bg-white text-gray-500 font-bold px-2 py-1 rounded-lg">🥩 {dish.protein}g P</span>
                                         </div>
                                      </div>
                                   </div>

                                   {/* Nutrients Details Table */}
                                   <div className="mt-6 pt-6 border-t border-white/50 grid grid-cols-4 gap-2 text-center">
                                      {[
                                         { key: 'Fat', val: dish.fat },
                                         { key: 'Carbs', val: dish.carbs },
                                         { key: 'Fiber', val: dish.fiber },
                                         { key: 'Sodium', val: dish.sodium || 0 }
                                      ].map(n => (
                                         <div key={n.key}>
                                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{n.key}</div>
                                            <div className="text-sm font-bold text-gray-700">{n.val}g</div>
                                         </div>
                                      ))}
                                   </div>

                                   <div className="mt-6 flex items-center space-x-3">
                                      <button 
                                         onClick={() => toast.success(`Log updated for ${dish.name}!`)}
                                         className="flex-1 bg-white text-[#2A5F2A] py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 border border-[#2A5F2A]/10 hover:bg-[#2A5F2A] hover:text-white transition-all shadow-sm"
                                      >
                                         <PlusCircle size={18} />
                                         <span>LOG TO TODAY</span>
                                      </button>
                                   </div>
                                </div>
                             )) : (
                                <div className="col-span-2 text-center py-12 text-gray-300 font-medium">No menu data available for this slot.</div>
                             )}
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           ))}
        </div>
      </div>
    </StudentLayout>
  );
}
