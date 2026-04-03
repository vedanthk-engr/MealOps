"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CircleDashed, PieChart, Star, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Status = 'ATE' | 'SKIPPED' | 'HALF';

export default function LoggingPage() {
  const [logs, setLogs] = useState<Record<string, { status: Status, rating?: number, comment?: string }>>({});
  
  // 1. Fetch Today's Menu for Logging
  const { data: menu } = useQuery({
    queryKey: ['menu-today-log'],
    queryFn: async () => {
      const { data } = await api.get('/api/menu/today');
      return data;
    },
    initialData: { BREAKFAST: [], LUNCH: [], DINNER: [] }
  });

  const updateLog = (dishId: string, status: Status) => {
    setLogs(prev => ({ ...prev, [dishId]: { ...prev[dishId], status } }));
  };

  const updateReview = (dishId: string, rating: number) => {
     setLogs(prev => ({ ...prev, [dishId]: { ...prev[dishId], rating } }));
  };

  const updateComment = (dishId: string, comment: string) => {
     setLogs(prev => ({ ...prev, [dishId]: { ...prev[dishId], comment } }));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const submission = {
         date: new Date().toISOString().split('T')[0],
         mealType: "DINNER", // For now simplified
         logs: Object.entries(logs).map(([id, l]) => ({
            dishId: id,
            status: l.status,
            emoji: l.rating ? ['BAD', 'MEH', 'OK', 'LOVED'][Math.min(l.rating-1, 3)] : 'OK',
            comment: l.comment
         }))
      };
      return api.post('/api/meals/log', submission);
    },
    onSuccess: () => {
       toast.success("Meal log submitted and nutrition stats updated!");
    },
    onError: () => toast.error("Failed to submit log. Please try again.")
  });

  const totalAddedCals = Object.entries(logs).reduce((sum, [id, l]) => {
     const mult = l.status === 'ATE' ? 1 : (l.status === 'HALF' ? 0.5 : 0);
     const dish = Object.values(menu).flat().find((d: any) => d.id === id) as any;
     return sum + (dish?.calories || 0) * mult;
  }, 0);

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Stats Floating Bar */}
        <div className="sticky top-24 z-30 bg-[#2A5F2A] text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl"><PieChart size={24} /></div>
              <div>
                 <p className="text-white/60 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Session Total</p>
                 <h2 className="text-2xl font-black">{Math.round(totalAddedCals)} <span className="text-sm font-medium opacity-70">KCALS</span></h2>
              </div>
           </div>
           
           <button 
             onClick={() => mutation.mutate()}
             disabled={Object.keys(logs).length === 0 || mutation.isPending}
             className="bg-[#F5A623] hover:bg-[#e0951b] px-8 py-3.5 rounded-2xl font-black text-sm transition-all disabled:opacity-50 flex items-center space-x-2"
           >
              {mutation.isPending ? "SUBMITTING..." : (
                <>
                  <CheckCircle2 size={18} />
                  <span>SUBMIT MEAL LOG</span>
                </>
              )}
           </button>
        </div>

        {/* Logging List */}
        <div className="space-y-12">
           {Object.entries(menu).map(([slot, dishes]: [string, any[]]) => (
              <div key={slot} className="space-y-6">
                 <h3 className="text-sm font-black text-gray-400 uppercase tracking-[4px] ml-4">{slot}</h3>
                 <div className="space-y-4">
                    {dishes.length > 0 ? dishes.map((dish) => (
                       <div key={dish.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col transition-all">
                          <div className="flex items-center justify-between mb-6">
                             <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100"><img src={dish.imageUrl || "/placeholder-dish.jpg"} className="w-full h-full object-cover" /></div>
                                <div>
                                   <h4 className="font-bold text-gray-800">{dish.name}</h4>
                                   <p className="text-[10px] font-bold text-gray-400">{dish.calories} kcal • {dish.isVeg ? 'VEG' : 'NON-VEG'}</p>
                                </div>
                             </div>

                             {/* Triple Toggle Buttons */}
                             <div className="bg-[#F5F3EE] p-1.5 rounded-2xl flex items-center space-x-1">
                                {['ATE', 'HALF', 'SKIPPED'].map((s) => (
                                   <button
                                     key={s}
                                     onClick={() => updateLog(dish.id, s as Status)}
                                     className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-black transition-all",
                                        logs[dish.id]?.status === s 
                                          ? (s === 'SKIPPED' ? "bg-red-500 text-white" : "bg-[#2A5F2A] text-white") 
                                          : "text-gray-400 hover:text-gray-600"
                                     )}
                                   >
                                      {s}
                                   </button>
                                ))}
                             </div>
                          </div>

                          <AnimatePresence>
                             {(logs[dish.id]?.status === 'ATE' || logs[dish.id]?.status === 'HALF') && (
                                <motion.div 
                                   initial={{ height: 0, opacity: 0 }}
                                   animate={{ height: 'auto', opacity: 1 }}
                                   exit={{ height: 0, opacity: 0 }}
                                   className="border-t border-gray-50 pt-6 space-y-4"
                                >
                                   <div className="flex items-center justify-between">
                                      <p className="text-xs font-bold text-gray-500">How was it?</p>
                                      <div className="flex space-x-2">
                                         {[1,2,3,4].map(star => (
                                            <button 
                                              key={star} 
                                              onClick={() => updateReview(dish.id, star)}
                                              className={cn("p-2 rounded-lg transition-colors", logs[dish.id]?.rating === star ? "bg-orange-100 text-[#F5A623]" : "bg-gray-50 text-gray-300")}
                                            >
                                               <Star size={16} fill={logs[dish.id]?.rating === star ? "currentColor" : "none"} />
                                            </button>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="relative">
                                      <input 
                                         type="text" 
                                         placeholder="Any specific comments? (e.g. Too spicy, Loved the taste...)"
                                         className="w-full bg-[#F5F3EE] px-4 py-3 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-[#2A5F2A]/10"
                                         value={logs[dish.id]?.comment || ''}
                                         onChange={(e) => updateComment(dish.id, e.target.value)}
                                      />
                                      <Send size={14} className="absolute right-4 top-3.5 text-gray-300" />
                                   </div>
                                </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                    )) : (
                       <div className="py-8 px-8 border border-dashed border-gray-200 rounded-3xl text-center text-gray-400 text-sm">No dishes found.</div>
                    )}
                 </div>
              </div>
           ))}
        </div>
      </div>
    </StudentLayout>
  );
}
