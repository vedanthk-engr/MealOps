"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, ShieldAlert, CheckCircle2, ChevronRight, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PreOrderPage() {
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [menuType, setMenuType] = useState<'REGULAR' | 'FEAST'>('REGULAR');

  // 1. Fetch Tomorrow's Menu
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const { data: menu } = useQuery({
    queryKey: ['menu-tomorrow'],
    queryFn: async () => {
       const { data } = await api.get(`/api/menu/${tomorrowStr}`);
       return data;
    },
    initialData: { BREAKFAST: [], LUNCH: [], DINNER: [] }
  });

  const toggleDish = (dishId: string) => {
    setSelectedDishes(prev => prev.includes(dishId) ? prev.filter(id => id !== dishId) : [...prev, dishId]);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const orders = selectedDishes.map(id => ({
         dishId: id,
         date: tomorrowStr,
         mealType: "DINNER", // Simplified for demo
         menuType
      }));
      return api.post('/api/preorders', { date: tomorrowStr, orders });
    },
    onSuccess: () => toast.success("Pre-order confirmed for tomorrow!"),
    onError: () => toast.error("Failed to place pre-order.")
  });

  const getEstimatedNutrition = () => {
     let cals = 0;
     selectedDishes.forEach(id => {
        const dish = Object.values(menu).flat().find((d: any) => d.id === id) as any;
        cals += dish?.calories || 0;
     });
     return cals;
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left: Menu Selection */}
        <div className="flex-1 space-y-10">
           <div className="flex items-center justify-between">
              <div>
                 <h1 className="text-3xl font-black text-gray-800">Pre-Order: Tomorrow</h1>
                 <p className="text-gray-400 text-sm mt-1">{new Date(tomorrowStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-orange-100">
                 {['REGULAR', 'FEAST'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setMenuType(t as any)}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-black transition-all",
                        menuType === t ? "bg-[#F5A623] text-white" : "text-gray-400"
                      )}
                    >
                       {t}
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-10">
              {['BREAKFAST', 'LUNCH', 'DINNER'].map(slot => (
                 <div key={slot} className="space-y-6">
                    <div className="flex items-center space-x-4">
                       <Utensils size={20} className="text-gray-300" />
                       <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{slot}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {menu[slot]?.length > 0 ? menu[slot].map((dish: any) => (
                          <motion.div
                            key={dish.id}
                            whileHover={{ y: -2 }}
                            onClick={() => toggleDish(dish.id)}
                            className={cn(
                               "p-4 rounded-3xl bg-white shadow-sm border-2 transition-all cursor-pointer relative",
                               selectedDishes.includes(dish.id) ? "border-[#2A5F2A]" : "border-transparent"
                            )}
                          >
                             <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100"><img src={dish.imageUrl || "/placeholder-dish.jpg"} className="w-full h-full object-cover" /></div>
                                <div className="flex-1">
                                   <h4 className="font-bold text-gray-800 truncate">{dish.name}</h4>
                                   <p className="text-[10px] font-bold text-gray-400">{dish.calories} kcal</p>
                                </div>
                                <div className={cn("p-2 rounded-full", selectedDishes.includes(dish.id) ? "bg-[#2A5F2A] text-white" : "bg-gray-100 text-gray-300")}>
                                   <CheckCircle2 size={16} />
                                </div>
                             </div>
                          </motion.div>
                       )) : <div className="col-span-2 p-6 rounded-3xl border-2 border-dashed border-gray-100 text-center text-gray-300 text-xs">Menu not available.</div>}
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Right: Summary Panel */}
        <div className="w-full lg:w-96 space-y-8 h-fit lg:sticky lg:top-24">
           
           {/* Countdown Banner */}
           <div className="bg-[#2A5F2A] rounded-3xl p-6 text-white text-center space-y-2 overflow-hidden relative">
              <Clock className="mx-auto text-white/50 mb-2" />
              <h3 className="text-xl font-black">2h 45m remaining</h3>
              <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest leading-none">To place pre-order</p>
              <div className="absolute top-0 right-0 p-4 opacity-5"><Package size={80} /></div>
           </div>

           {/* Summary Card */}
           <div className="bg-white rounded-[40px] p-8 shadow-xl border border-orange-50 flex flex-col space-y-8">
              <h3 className="text-lg font-black text-gray-800">Order Summary</h3>
              
              <div className="space-y-4">
                 {selectedDishes.length > 0 ? selectedDishes.map(id => {
                    const dish = Object.values(menu).flat().find((d: any) => d.id === id) as any;
                    return (
                       <div key={id} className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-600 truncate max-w-[200px]">{dish?.name}</span>
                          <span className="text-xs font-bold text-[#2A5F2A]">{dish?.calories} cal</span>
                       </div>
                    );
                 }) : (
                    <div className="text-center py-8 text-gray-400 text-xs font-bold uppercase opacity-60">No items selected</div>
                 )}
              </div>

              <div className="pt-8 border-t border-gray-50">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Estimated Intake</p>
                       <h4 className="text-3xl font-black text-[#2A5F2A]">{getEstimatedNutrition()} <span className="text-xs font-medium">KCALS</span></h4>
                    </div>
                 </div>

                 <button
                   onClick={() => mutation.mutate()}
                   disabled={selectedDishes.length === 0 || mutation.isPending}
                   className="w-full py-5 bg-[#F5A623] hover:bg-[#e0951b] text-white rounded-[24px] font-black text-lg transition-all shadow-xl shadow-orange-100 disabled:opacity-30 disabled:shadow-none"
                 >
                    {mutation.isPending ? "CONFIRMING..." : "CONFIRM SELECTIONS"}
                 </button>
              </div>

              <div className="bg-[#F5F3EE] p-4 rounded-2xl flex items-start space-x-3">
                 <ShieldAlert className="text-[#F5A623] flex-shrink-0" size={18} />
                 <p className="text-[10px] text-gray-500 font-medium leading-tight">
                    Double check your choices. Once order is confirmed, changes are not allowed after the 9 PM deadline.
                 </p>
              </div>
           </div>

        </div>

      </div>
    </StudentLayout>
  );
}
