"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { ShoppingCart, Calendar, ChevronRight, Clock, Utensils, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { MENU_ITEMS } from '@/lib/new-ui-data';
import { cn } from '@/lib/utils';

export default function PreOrderPage() {
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['1', '3']);

  const toggleMeal = (id: string) => {
    setSelectedMeals((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  const meals = [
    { id: 'Breakfast', icon: Clock, time: '07:30 AM', color: 'bg-secondary-fixed' },
    { id: 'Lunch', icon: Utensils, time: '12:30 PM', color: 'bg-primary-fixed' },
    { id: 'Dinner', icon: Clock, time: '07:30 PM', color: 'bg-tertiary-fixed' },
  ] as const;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto px-8 lg:px-16 pb-40 pt-12 space-y-20">
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
            <div>
              <h2 className="text-8xl font-black text-on-surface tracking-tighter leading-[0.8] mb-6">Future<br/>Harvest.</h2>
              <p className="text-sm font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 italic">Pre-order for April 25, 2026</p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-low p-4 px-6 rounded-[1.5rem] shadow-sm">
              <Calendar size={20} className="text-primary/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Strategic Selection</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-12 rounded-[3.5rem] text-on-surface flex flex-col md:flex-row items-center justify-between shadow-[0px_32px_80px_rgba(27,28,25,0.08)] mb-20 border-0 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="flex items-center gap-10 relative z-10">
              <div className="w-24 h-24 rounded-[2rem] bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/30">
                <ShoppingCart size={40} />
              </div>
              <div>
                <h3 className="text-4xl font-black tracking-tighter text-on-surface leading-tight">Harvest Confirmation.</h3>
                <p className="text-sm font-medium text-on-surface-variant opacity-60 mt-2">Reduce agricultural wastage by 40% through precise planning.</p>
              </div>
            </div>
            <div className="text-right hidden md:block relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 opacity-50">Anticipated Energy Flux</p>
              <p className="text-6xl font-black tracking-tighter text-primary">1,240 <span className="text-xl font-black text-on-surface-variant uppercase opacity-20">KCAL</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {meals.map((meal) => (
              <div key={meal.id} className="space-y-10 group/col">
                <div className="flex items-center gap-6 mb-8">
                   <h4 className="text-3xl font-black text-on-surface tracking-tighter">{meal.id}.</h4>
                   <div className="h-[2px] flex-1 bg-surface-container-high opacity-30 group-hover/col:opacity-100 transition-opacity" />
                   <p className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">{meal.time}</p>
                </div>

                <div className="space-y-6">
                  {MENU_ITEMS.filter((item) => item.category === meal.id).map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -8 }}
                      onClick={() => toggleMeal(item.id)}
                      className={cn(
                        'p-6 rounded-[2.5rem] transition-all cursor-pointer flex gap-6 items-center border-0 shadow-[0px_10px_32px_rgba(27,28,25,0.02)]',
                        selectedMeals.includes(item.id)
                          ? 'bg-primary text-white shadow-2xl shadow-primary/20 scale-105 z-10'
                          : 'bg-surface-container-low hover:bg-surface-container-lowest hover:shadow-xl',
                      )}
                    >
                      <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shrink-0 shadow-inner">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-black tracking-tight leading-tight uppercase">{item.name}</h5>
                        <p className={cn('text-[10px] font-black uppercase tracking-widest mt-1', selectedMeals.includes(item.id) ? 'text-white/60' : 'text-on-surface-variant opacity-40')}>
                          {item.calories} KCAL
                        </p>
                      </div>
                      <div className={cn('w-8 h-8 rounded-full border-0 flex items-center justify-center transition-all', selectedMeals.includes(item.id) ? 'bg-white text-primary shadow-lg' : 'bg-surface-container-high text-transparent')}>
                        <CheckCircle2 size={16} fill="currentColor" stroke="none" className={selectedMeals.includes(item.id) ? 'text-primary' : 'text-transparent'} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-surface-container-low p-10 rounded-[2.5rem] flex items-center gap-8 border-0 mt-20">
          <div className="p-4 bg-primary/5 text-primary rounded-[1.5rem] backdrop-blur-xl">
             <Info size={28} />
          </div>
          <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest leading-relaxed opacity-60">
            Temporal Constraint: Selection modifications permitted until 10:00 PM. Prioritized fulfillment active.
          </p>
        </div>

        {/* Floating Confirmation Bar */}
        <motion.div 
           initial={{ y: 100 }}
           animate={{ y: 0 }}
           className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-2xl bg-surface-container-lowest p-6 rounded-[2.5rem] shadow-[0px_32px_80px_rgba(27,28,25,0.15)] flex items-center justify-between border-0 transition-all"
        >
           <div className="flex items-center space-x-6 pl-4">
              <div className="p-4 bg-primary/5 text-primary rounded-[1.5rem]"><ShoppingCart size={28} /></div>
              <div>
                 <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-50">Active Basket</p>
                 <h2 className="text-3xl font-black text-on-surface tracking-tighter">{selectedMeals.length} <span className="text-xs font-black opacity-30">SELECTIONS</span></h2>
              </div>
           </div>
           
           <button 
             className="bg-gradient-to-br from-primary to-primary-container text-white hover:scale-105 active:scale-95 px-10 py-5 rounded-[1.6rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center space-x-3 shadow-xl shadow-primary/20"
           >
              <span>CONFIRM PROTOCOL</span>
              <ChevronRight size={18} />
           </button>
        </motion.div>
      </div>
    </StudentLayout>
  );
}
