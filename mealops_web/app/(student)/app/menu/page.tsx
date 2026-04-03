"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { motion } from 'framer-motion';
import { Sun, Utensils, Moon, ChevronDown, PlusCircle } from 'lucide-react';
import { MENU_ITEMS } from '@/lib/new-ui-data';
import { cn } from '@/lib/utils';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MenuPage() {
   const [activeDay, setActiveDay] = useState('Wed');
   const categories = [
      { id: 'Breakfast', icon: Sun, time: '07:30 AM - 09:30 AM', color: 'bg-secondary-fixed', textColor: 'text-on-secondary-fixed-variant' },
      { id: 'Lunch', icon: Utensils, time: '12:30 PM - 02:30 PM', color: 'bg-primary-fixed', textColor: 'text-on-primary-fixed-variant' },
      { id: 'Dinner', icon: Moon, time: '07:30 PM - 09:30 PM', color: 'bg-tertiary-fixed', textColor: 'text-on-tertiary-fixed' },
   ] as const;

  return (
    <StudentLayout>
         <div className="max-w-[1400px] mx-auto">
            <section className="mb-12">
               <div className="flex items-baseline justify-between mb-6">
                  <h2 className="text-4xl font-headline font-extrabold tracking-tight text-primary">Weekly Harvest</h2>
                  <span className="text-sm font-medium text-on-surface-variant bg-surface-container-low px-4 py-1 rounded-full">April 15 - April 21</span>
               </div>
               <div className="flex gap-4 border-b border-outline-variant/15 overflow-x-auto hide-scrollbar">
                  {days.map((day) => (
                     <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={cn(
                           'px-6 py-4 text-sm font-bold transition-colors relative whitespace-nowrap',
                           activeDay === day ? 'text-primary' : 'text-on-surface-variant hover:text-primary',
                        )}
                     >
                        {day}
                        {activeDay === day && <motion.div layoutId="activeDay" className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full" />}
                     </button>
                  ))}
               </div>
            </section>

            <div className="space-y-12">
               {categories.map((cat) => (
                  <section key={cat.id} className="group">
                     <div className="flex items-center justify-between mb-6 cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', cat.color, cat.textColor)}>
                              <cat.icon size={24} />
                           </div>
                           <div>
                              <h3 className="text-2xl font-headline font-extrabold">{cat.id}</h3>
                              <p className="text-sm font-medium text-on-surface-variant">{cat.time} - {MENU_ITEMS.filter((i) => i.category === cat.id).length} Options Available</p>
                           </div>
                        </div>
                        <ChevronDown className="text-primary transition-transform group-hover:translate-y-1" />
                     </div>

                     <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-6 -mx-4 px-4">
                        {MENU_ITEMS.filter((item) => item.category === cat.id).map((item) => (
                           <motion.div key={item.id} whileHover={{ y: -4 }} className="min-w-[700px] flex bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0px_12px_32px_rgba(27,28,25,0.04)] hover:shadow-[0px_12px_32px_rgba(27,28,25,0.08)] transition-all">
                              <div className="w-[280px] h-full relative">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                    <div className={cn('w-2 h-2 rounded-full', item.type === 'VEG' ? 'bg-primary' : 'bg-error')} />
                                    <span className={cn('text-[10px] font-bold uppercase tracking-wider', item.type === 'VEG' ? 'text-primary' : 'text-error')}>
                                       {item.type === 'VEG' ? 'Veg' : 'Non-Veg'}
                                    </span>
                                 </div>
                              </div>
                              <div className="flex-1 p-8 flex flex-col">
                                 <div className="flex justify-between items-start mb-2 gap-4">
                                    <h4 className="text-2xl font-headline font-extrabold text-on-surface">{item.name}</h4>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                       {item.tags.map((tag) => (
                                          <span key={tag} className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold uppercase tracking-tight">
                                             {tag}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                                 <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{item.description}</p>

                                 <div className="space-y-3 mb-8 flex-1">
                                    <NutritionStat label="Calories" value={item.calories} max={800} color="bg-secondary" />
                                    <NutritionStat label="Protein" value={item.protein} unit="g" max={50} color="bg-primary" />
                                    <NutritionStat label="Carbs" value={item.carbs} unit="g" max={100} color="bg-secondary-container" />
                                    <NutritionStat label="Fat" value={item.fats} unit="g" max={40} color="bg-tertiary-container" />
                                 </div>

                                 <button className="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]">
                                    <PlusCircle size={18} />
                                    Add to Log
                                 </button>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </section>
               ))}
        </div>
      </div>
    </StudentLayout>
  );
}

function NutritionStat({ label, value, unit = '', max, color }: { label: string; value: number; unit?: string; max: number; color: string }) {
   return (
      <div className="space-y-1">
         <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase">
            <span>{label}</span>
            <span>{value}{unit}</span>
         </div>
         <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }} className={cn('h-full rounded-full', color)} />
         </div>
      </div>
   );
}
