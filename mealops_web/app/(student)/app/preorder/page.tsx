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
      <div className="max-w-7xl mx-auto px-4 lg:px-10 pb-20">
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-4xl font-headline font-extrabold text-primary tracking-tight">Pre-Order Tomorrow</h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-sm font-bold text-on-surface-variant">
              <Calendar size={18} />
              <span>April 25, 2026</span>
            </div>
          </div>

          <div className="bg-primary-fixed p-8 rounded-[2rem] text-on-primary-fixed-variant flex items-center justify-between shadow-xl mb-12 border border-primary/10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-primary/20">
                <ShoppingCart size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-headline font-extrabold">Confirm Your Harvest</h3>
                <p className="text-on-surface-variant font-medium">Pre-ordering helps us reduce wastage by 40%.</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Estimated Calories</p>
              <p className="text-4xl font-black tracking-tighter">1,240 <span className="text-sm font-bold text-on-surface-variant uppercase">kcal</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {meals.map((meal) => (
              <div key={meal.id} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', meal.color)}>
                    <meal.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-headline font-extrabold text-primary">{meal.id}</h4>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{meal.time}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {MENU_ITEMS.filter((item) => item.category === meal.id).map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => toggleMeal(item.id)}
                      className={cn(
                        'p-5 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-center',
                        selectedMeals.includes(item.id)
                          ? 'bg-primary/5 border-primary shadow-md'
                          : 'bg-surface-container-low border-transparent hover:border-primary/20',
                      )}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-on-surface leading-tight">{item.name}</h5>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">{item.calories} kcal</p>
                      </div>
                      <div className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors', selectedMeals.includes(item.id) ? 'bg-primary border-primary text-white' : 'border-outline-variant/30')}>
                        {selectedMeals.includes(item.id) && <CheckCircle2 size={14} />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-surface-container-low p-6 rounded-2xl flex items-center gap-4 mb-12">
          <Info className="text-primary" size={24} />
          <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
            Pre-orders can be modified up to 10:00 PM tonight. Your selection will be prioritized at the counter tomorrow.
          </p>
        </div>

        <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl py-6 px-8 border border-outline-variant/10 rounded-2xl">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Total Selection:</span>
            <span className="text-xl font-black text-primary">{selectedMeals.length} Meals</span>
          </div>
          <button className="bg-white text-primary border border-primary/20 px-8 py-3 rounded-2xl font-bold text-lg shadow-[0px_8px_24px_rgba(47,143,58,0.12)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
            <span>Confirm Pre-Order</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </StudentLayout>
  );
}
