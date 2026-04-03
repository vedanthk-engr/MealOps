"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { Flame, Egg, Wheat, Droplets, Leaf, BookOpen, Scan, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MENU_ITEMS } from '@/lib/new-ui-data';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

export default function StudentDashboard() {
   const user = useAuthStore((s) => s.user);
   const [selectedMealCategory, setSelectedMealCategory] = useState('Lunch');

  const macros = [
      { label: 'Calories Today', value: '1,840', goal: '2400', icon: Flame, color: 'text-primary', bg: 'bg-primary-fixed/30' },
      { label: 'Protein', value: '112g', goal: '140', icon: Egg, color: 'text-secondary', bg: 'bg-secondary-fixed/30' },
      { label: 'Carbs', value: '245g', goal: '250', icon: Wheat, color: 'text-tertiary', bg: 'bg-tertiary-fixed/30' },
      { label: 'Fat', value: '54g', goal: '65', icon: Droplets, color: 'text-[#8B4513]', bg: 'bg-[#8B4513]/10' },
  ];

   const nutritionData = [
      { name: 'Calories', value: 76, color: '#104715' },
      { name: 'Remaining', value: 24, color: '#f0eee9' },
   ];

  return (
    <StudentLayout>
         <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 xl:col-span-8 space-y-10">
               <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {macros.map((stat, i) => (
                     <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0px_12px_32px_rgba(27,28,25,0.04)]"
                     >
                        <div className="flex items-center justify-between mb-4">
                           <stat.icon className={cn(stat.color, stat.bg, 'p-2 rounded-xl')} size={36} />
                           <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Goal: {stat.goal}</span>
                        </div>
                        <p className="text-2xl font-black text-on-surface">{stat.value}</p>
                        <p className="text-xs font-semibold text-on-surface-variant">{stat.label}</p>
                     </motion.div>
                  ))}
               </section>

               <section>
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                     <div>
                        <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Today's Harvest</h3>
                        <p className="text-on-surface-variant font-medium">Fresh meals curated for your metabolic profile.</p>
                     </div>
                     <div className="flex bg-surface-container p-1 rounded-xl">
                        {['Breakfast', 'Lunch', 'Dinner'].map((cat) => (
                           <button
                              key={cat}
                              onClick={() => setSelectedMealCategory(cat)}
                              className={cn(
                                 'px-6 py-2 rounded-lg text-sm font-extrabold transition-all',
                                 selectedMealCategory === cat ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface',
                              )}
                           >
                              {cat}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     {MENU_ITEMS.filter((item) => item.category === selectedMealCategory).map((item, i) => (
                        <motion.div
                           key={item.id}
                           initial={{ opacity: 0, y: 16 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.08 }}
                           className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                           <div className="relative h-44">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary tracking-wider">
                                 {item.calories} KCAL
                              </div>
                           </div>
                           <div className="p-6">
                              <div className="flex justify-between items-start mb-3 gap-3">
                                 <h4 className="text-lg font-extrabold text-on-surface leading-tight">{item.name}</h4>
                                 <Leaf size={16} className="text-primary" />
                              </div>
                              <div className="flex flex-wrap gap-2 mb-5">
                                 {item.tags.map((tag) => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">
                                       {tag}
                                    </span>
                                 ))}
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-surface-container">
                                 <button className="text-xs font-bold text-primary underline underline-offset-4">Details</button>
                                 <button className="px-6 py-2 rounded-full border border-primary text-primary text-xs font-black hover:bg-primary hover:text-white transition-all active:scale-95">
                                    Log Meal
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </section>
            </div>

            <div className="col-span-12 xl:col-span-4 space-y-8">
               <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_12px_32px_rgba(27,28,25,0.06)] border border-outline-variant/5">
                  <h3 className="text-xl font-extrabold text-on-surface mb-6">Today's Nutrition</h3>
                  <div className="relative flex justify-center items-center h-48">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie data={nutritionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
                              {nutritionData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                              ))}
                           </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute text-center">
                        <p className="text-3xl font-black text-on-surface tracking-tighter">76%</p>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Of Target</p>
                     </div>
                  </div>
               </div>

               <div className="bg-primary-fixed p-8 rounded-2xl shadow-xl border border-primary/10 text-on-primary-fixed-variant">
                  <div className="flex items-center gap-3 mb-6">
                     <ShoppingCart size={20} />
                     <h3 className="text-xl font-extrabold tracking-tight">Pre-Order Tomorrow</h3>
                  </div>
                  <button className="w-full py-4 mt-4 bg-white text-primary border border-primary/20 font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all">
                     Confirm Order
                  </button>
               </div>

               <div className="bg-surface-container-high/50 p-6 rounded-2xl border-l-4 border-secondary">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2">Editor's Note</p>
                  <p className="text-sm font-medium text-on-surface leading-relaxed italic">
                     "Adding just 5g of extra fiber to your lunch can stabilize your metabolic response for the entire afternoon study session."
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-on-surface-variant">
                     <BookOpen size={12} />
                     <span>Source: Harvest Nutrition Guide</span>
                  </div>
               </div>
            </div>
      </div>
    </StudentLayout>
  );
}
