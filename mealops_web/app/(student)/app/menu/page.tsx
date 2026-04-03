"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { motion } from 'framer-motion';
import { Sun, Utensils, Moon, ChevronDown, PlusCircle, Leaf } from 'lucide-react';
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
          <div className="max-w-7xl mx-auto pb-32">
             <section className="mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                   <div>
                      <h2 className="text-7xl font-black text-on-surface tracking-tighter leading-[0.8] mb-6">Weekly<br/>Harvest.</h2>
                      <p className="text-sm font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">April 15 - April 21, 2024</p>
                   </div>
                   <div className="flex bg-surface-container-low p-2 rounded-[2rem] shadow-sm hide-scrollbar overflow-x-auto">
                      {days.map((day) => (
                         <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={cn(
                               'w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-xs font-black transition-all uppercase tracking-widest',
                               activeDay === day ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'text-on-surface-variant hover:text-on-surface',
                            )}
                         >
                            {day}
                         </button>
                      ))}
                   </div>
                </div>
             </section>

             <div className="space-y-24">
                {categories.map((cat) => (
                   <section key={cat.id} className="group">
                      <div className="flex items-center justify-between mb-10">
                         <div className="flex items-baseline gap-6">
                            <h3 className="text-5xl font-black text-on-surface tracking-tighter leading-none">{cat.id}.</h3>
                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.25em] opacity-50">{cat.time}</p>
                         </div>
                         <div className="h-[2px] flex-1 bg-surface-container-high mx-10 hidden lg:block opacity-30" />
                         <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest">{MENU_ITEMS.filter((i) => i.category === cat.id).length} SELECTIONS</span>
                           <ChevronDown className="text-primary/40 group-hover:text-primary transition-transform group-hover:translate-y-1 duration-500" />
                         </div>
                      </div>

                      <div className="flex gap-10 overflow-x-auto hide-scrollbar pb-10 -mx-10 px-10">
                         {MENU_ITEMS.filter((item) => item.category === cat.id).map((item) => (
                            <motion.div 
                               key={item.id} 
                               whileHover={{ y: -10 }} 
                               className="min-w-[800px] flex bg-surface-container-lowest rounded-[3rem] overflow-hidden shadow-[0px_20px_64px_rgba(27,28,25,0.03)] hover:shadow-2xl transition-all duration-700"
                            >
                               <div className="w-[340px] relative overflow-hidden group/img">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-black/0 to-surface-container-lowest/10" />
                                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
                                     <div className={cn('w-2 h-2 rounded-full animate-pulse', item.type === 'VEG' ? 'bg-primary' : 'bg-error')} />
                                     <span className={cn('text-[10px] font-black uppercase tracking-[0.1em]', item.type === 'VEG' ? 'text-primary' : 'text-error')}>
                                        {item.type === 'VEG' ? 'Veg Only' : 'Premium Non-Veg'}
                                     </span>
                                  </div>
                               </div>
                               <div className="flex-1 p-10 flex flex-col justify-between">
                                  <div>
                                     <div className="flex justify-between items-start mb-4 gap-6">
                                        <h4 className="text-3xl font-black text-on-surface leading-[0.9] tracking-tighter">{item.name}</h4>
                                        <div className="flex gap-2 flex-wrap justify-end">
                                           {item.tags.map((tag) => (
                                              <span key={tag} className="px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-[9px] font-black uppercase tracking-widest border border-surface-container-high">
                                                 {tag}
                                              </span>
                                           ))}
                                        </div>
                                     </div>
                                     <p className="text-sm font-medium text-on-surface-variant leading-relaxed mb-10 opacity-80">{item.description}</p>

                                     <div className="grid grid-cols-2 gap-x-10 gap-y-6 mb-12">
                                        <NutritionStat label="Energy" value={item.calories} max={800} color="bg-primary" />
                                        <NutritionStat label="Protein" value={item.protein} unit="g" max={50} color="bg-secondary" />
                                        <NutritionStat label="Carbs" value={item.carbs} unit="g" max={100} color="bg-primary/20" />
                                        <NutritionStat label="Fat" value={item.fats} unit="g" max={40} color="bg-tertiary-container" />
                                     </div>
                                  </div>

                                  <div className="flex items-center gap-6">
                                     <button className="flex-1 py-5 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary-container text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                        <PlusCircle size={20} />
                                        Harvest Intake
                                     </button>
                                     <button className="p-5 rounded-[1.5rem] bg-surface-container-low text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                                        <Leaf size={20} />
                                     </button>
                                  </div>
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
