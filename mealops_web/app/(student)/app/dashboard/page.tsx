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
          <div className="grid grid-cols-12 gap-10 items-start pb-20">
             <div className="col-span-12 xl:col-span-8 space-y-16">
                <div>
                   <h2 className="text-7xl font-black text-on-surface tracking-tighter leading-[0.85] mb-4">
                      Fueling<br/>Your Brilliance.
                   </h2>
                   <p className="max-w-md text-on-surface-variant font-medium text-lg leading-relaxed">
                      Your metabolic performance is the foundation of your academic excellence.
                   </p>
                </div>

                <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {macros.map((stat, i) => (
                      <motion.div
                         key={stat.label}
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                         className="bg-surface-container-lowest p-7 rounded-[2rem] shadow-[0px_20px_48px_rgba(27,28,25,0.04)] hover:shadow-2xl transition-all duration-500 group cursor-default"
                      >
                         <div className="flex items-center justify-between mb-6">
                            <div className={cn('p-3 rounded-2xl transition-transform group-hover:rotate-12 duration-500', stat.bg)}>
                               <stat.icon className={cn(stat.color)} size={28} />
                            </div>
                            <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">{stat.goal} Target</span>
                         </div>
                         <p className="text-3xl font-black text-on-surface tracking-tighter">{stat.value}</p>
                         <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
                      </motion.div>
                   ))}
                </section>

                <section>
                   <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                      <div className="space-y-2">
                         <h3 className="text-4xl font-black text-on-surface tracking-tighter">The Daily Harvest.</h3>
                         <div className="h-1 w-20 bg-secondary rounded-full" />
                      </div>
                      <div className="flex bg-surface-container-low p-1.5 rounded-[1.5rem]">
                         {['Breakfast', 'Lunch', 'Dinner'].map((cat) => (
                            <button
                               key={cat}
                               onClick={() => setSelectedMealCategory(cat)}
                               className={cn(
                                  'px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all',
                                  selectedMealCategory === cat ? 'bg-white text-primary shadow-xl shadow-primary/5 scale-105' : 'text-on-surface-variant hover:text-on-surface',
                               )}
                            >
                               {cat}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      {MENU_ITEMS.filter((item) => item.category === selectedMealCategory).map((item, i) => (
                         <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-[0px_10px_40px_rgba(27,28,25,0.03)] hover:shadow-2xl transition-all duration-700"
                         >
                            <div className="relative h-56 overflow-hidden">
                               <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                               <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-xl px-5 py-2 rounded-full text-[11px] font-black text-primary tracking-[0.1em] shadow-lg">
                                  {item.calories} KCAL
                               </div>
                               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="p-8">
                               <div className="flex justify-between items-start mb-4">
                                  <h4 className="text-2xl font-black text-on-surface leading-tight tracking-tight">{item.name}</h4>
                                  <Leaf size={20} className="text-primary/40 group-hover:text-primary transition-colors" />
                               </div>
                               <div className="flex flex-wrap gap-2 mb-8">
                                  {item.tags.map((tag) => (
                                     <span key={tag} className="px-4 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-[10px] font-black uppercase tracking-wider group-hover:bg-primary-fixed group-hover:text-on-primary-fixed-variant transition-colors">
                                        {tag}
                                     </span>
                                  ))}
                               </div>
                               <div className="flex items-center justify-between pt-6 border-t border-surface-container/50">
                                  <button className="text-xs font-black text-primary uppercase tracking-[0.2em] hover:opacity-100 opacity-40 transition-opacity">Details</button>
                                  <button className="px-8 py-3.5 rounded-full bg-gradient-to-br from-primary to-primary-container text-white text-[11px] font-black uppercase tracking-[0.15em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                     Log Harvest
                                  </button>
                               </div>
                            </div>
                         </motion.div>
                      ))}
                   </div>
                </section>
             </div>

             <div className="col-span-12 xl:col-span-4 space-y-10 lg:sticky lg:top-32">
                <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-[0px_32px_64px_rgba(27,28,25,0.05)] border-0">
                   <h3 className="text-2xl font-black text-on-surface mb-8 tracking-tight">Vitals Summary.</h3>
                   <div className="relative flex justify-center items-center h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie 
                               data={nutritionData} 
                               cx="50%" 
                               cy="50%" 
                               innerRadius={75} 
                               outerRadius={105} 
                               dataKey="value" 
                               startAngle={90} 
                               endAngle={-270}
                               paddingAngle={2}
                            >
                               {nutritionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                               ))}
                            </Pie>
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute text-center">
                         <p className="text-5xl font-black text-on-surface tracking-tighter leading-none">76<span className="text-2xl opacity-30">%</span></p>
                         <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-2">Daily Intake</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="bg-surface-container-low p-4 rounded-3xl text-center">
                        <p className="text-sm font-black text-on-surface">1,840</p>
                        <p className="text-[8px] font-bold text-on-surface-variant uppercase">Current</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-3xl text-center">
                        <p className="text-sm font-black text-primary">2,400</p>
                        <p className="text-[8px] font-bold text-primary/60 uppercase">Target</p>
                      </div>
                   </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-primary-container p-10 rounded-[2.5rem] shadow-2xl shadow-primary/20 text-white relative overflow-hidden group">
                   <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                   <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <ShoppingCart size={24} />
                         </div>
                         <h3 className="text-3xl font-black tracking-tighter leading-tight">Pre-Order<br/>Tomorrow.</h3>
                      </div>
                      <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed">
                        Secure your fresh non-veg breakfast by confirming before 10 PM tonight.
                      </p>
                      <button className="w-full py-5 bg-white text-primary font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-xl shadow-black/10">
                         Confirm & Book
                      </button>
                   </div>
                </div>

                <div className="bg-surface-container-low p-8 rounded-[2.5rem] relative">
                   <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4">Agrarian wisdom</p>
                   <p className="text-lg font-bold text-on-surface leading-tight italic">
                      "Adding just 5g of extra fiber to your lunch can stabilize your metabolic response for the entire afternoon study session."
                   </p>
                   <div className="flex items-center gap-3 mt-8 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                      <BookOpen size={14} />
                      <span>The Harvest Guide / Vol 4</span>
                   </div>
                </div>
             </div>
          </div>
    </StudentLayout>
  );
}
