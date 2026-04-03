"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, PieChart, Star, Send } from 'lucide-react';
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
         <div className="max-w-4xl mx-auto space-y-20 pb-40">
            <div>
               <h2 className="text-8xl font-black text-on-surface tracking-tighter leading-[0.8] mb-6">Daily<br/>Logbook.</h2>
               <p className="text-sm font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">Chronicle your nutritional journey today.</p>
            </div>
        
        {/* Logging List */}
        <div className="space-y-16">
           {Object.entries(menu as Record<string, any[]>).map(([slot, dishes]) => (
              <div key={slot} className="space-y-8">
                 <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-black text-on-surface tracking-tighter">{slot}.</h3>
                    <div className="h-[2px] flex-1 bg-surface-container-high opacity-30" />
                 </div>
                 <div className="space-y-6">
                    {dishes.length > 0 ? dishes.map((dish: any) => (
                       <div key={dish.id} className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-[0px_20px_48px_rgba(27,28,25,0.03)] hover:shadow-2xl transition-all duration-700 flex flex-col group">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                             <div className="flex items-center space-x-6">
                                <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-surface-container shadow-inner">
                                   <img src={dish.imageUrl || "/placeholder-dish.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={dish.name} />
                                </div>
                                <div>
                                   <h4 className="text-xl font-black text-on-surface tracking-tight">{dish.name}</h4>
                                   <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">
                                      {dish.calories} kcal • {dish.isVeg ? 'VEG' : 'NON-VEG'}
                                   </p>
                                </div>
                             </div>

                             {/* Triple Toggle Buttons */}
                             <div className="bg-surface-container-low p-2 rounded-3xl flex items-center gap-2">
                                {['ATE', 'HALF', 'SKIPPED'].map((s) => (
                                   <button
                                     key={s}
                                     onClick={() => updateLog(dish.id, s as Status)}
                                     className={cn(
                                        "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        logs[dish.id]?.status === s 
                                          ? (s === 'SKIPPED' ? "bg-error text-white shadow-xl shadow-error/20" : "bg-primary text-white shadow-xl shadow-primary/20") 
                                          : "text-on-surface-variant/40 hover:text-on-surface"
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
                                   className="border-t border-surface-container-high/50 pt-8 mt-4 space-y-6"
                                >
                                   <div className="flex items-center justify-between">
                                      <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest opacity-40">Sensory Evaluation</p>
                                      <div className="flex space-x-3">
                                         {[1,2,3,4].map(star => (
                                            <button 
                                              key={star} 
                                              onClick={() => updateReview(dish.id, star)}
                                              className={cn("p-3 rounded-2xl transition-all duration-300", logs[dish.id]?.rating === star ? "bg-secondary text-white shadow-lg shadow-secondary/20 scale-110" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high")}
                                            >
                                               <Star size={18} fill={logs[dish.id]?.rating === star ? "currentColor" : "none"} />
                                            </button>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="relative group/input">
                                      <input 
                                         type="text" 
                                         placeholder="Critique this harvest..."
                                         className="w-full bg-surface-container-low px-6 py-4 rounded-2xl text-xs font-medium outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                                         value={logs[dish.id]?.comment || ''}
                                         onChange={(e) => updateComment(dish.id, e.target.value)}
                                      />
                                      <Send size={16} className="absolute right-6 top-4.5 text-primary/30 group-focus-within/input:text-primary transition-colors" />
                                   </div>
                                </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                    )) : (
                       <div className="py-12 px-8 bg-surface-container-low rounded-[2.5rem] text-center text-on-surface-variant text-sm font-black uppercase tracking-widest opacity-30">No dishes in this selection.</div>
                    )}
                 </div>
              </div>
           ))}
        </div>

        {/* Floating Harvest Bar at Bottom */}
        <motion.div 
           initial={{ y: 100 }}
           animate={{ y: 0 }}
           className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-2xl bg-surface-container-lowest p-6 rounded-[2.5rem] shadow-[0px_32px_80px_rgba(27,28,25,0.15)] flex items-center justify-between border-0"
        >
           <div className="flex items-center space-x-6 pl-4">
              <div className="p-4 bg-primary/5 text-primary rounded-[1.5rem]"><PieChart size={28} /></div>
              <div>
                 <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-50">Total Intake Captured</p>
                 <h2 className="text-3xl font-black text-on-surface tracking-tighter">{Math.round(totalAddedCals)} <span className="text-xs font-black opacity-30">KCALS</span></h2>
              </div>
           </div>
           
           <button 
             onClick={() => mutation.mutate()}
             disabled={Object.keys(logs).length === 0 || mutation.isPending}
             className="bg-gradient-to-br from-primary to-primary-container text-white hover:scale-105 active:scale-95 px-10 py-5 rounded-[1.6rem] font-black text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:scale-100 flex items-center space-x-3 shadow-xl shadow-primary/20"
           >
              {mutation.isPending ? "ARCHIVING..." : (
                <>
                  <CheckCircle2 size={20} />
                  <span>COMMIT LOG</span>
                </>
              )}
           </button>
        </motion.div>
      </div>
    </StudentLayout>
  );
}
