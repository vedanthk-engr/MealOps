"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout';
import { motion } from 'framer-motion';
import { Package, Clipboard, TrendingUp, Users, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPreOrdersPage() {
  const [selectedSlot, setSelectedSlot] = useState('BREAKFAST');

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Statistics Floating Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: 'Total Pre-Orders', val: '1,540', icon: Clipboard, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Confirmed Today', val: '92%', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
             { label: 'Average Prep Rate', val: '12m', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
           ].map((s, i) => (
             <motion.div 
               key={s.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
                className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/10 flex items-center space-x-6"
             >
                <div className={cn("p-4 rounded-3xl", s.bg, s.color)}><s.icon size={28} /></div>
                <div>
                      <h3 className="text-3xl font-black text-on-surface leading-none mb-1">{s.val} <span className="text-[10px] opacity-20">LTD</span></h3>
                      <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest leading-none">{s.label}</p>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Slot Selector & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/10 sticky top-24 z-30">
           <div className="flex bg-surface-container-low p-1.5 rounded-2xl">
              {['BREAKFAST', 'LUNCH', 'DINNER'].map(s => (
                 <button 
                   key={s} 
                   onClick={() => setSelectedSlot(s)}
                   className={cn(
                     "px-8 py-3 rounded-xl text-xs font-black transition-all",
                     selectedSlot === s ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-on-surface-variant hover:text-on-surface"
                   )}
                 >
                    {s}
                 </button>
              ))}
           </div>
           
           <div className="relative group flex-1 max-w-md">
              <input type="text" placeholder="Search dish or student..." className="w-full pl-12 pr-6 py-4 bg-surface-container-low rounded-3xl text-sm font-bold border-2 border-transparent focus:border-primary/10 outline-none transition-all" />
              <Search className="absolute left-4 top-4 text-on-surface-variant group-focus-within:text-primary transition-colors" size={20} />
           </div>
        </div>

        {/* Orders Aggregated View */}
        <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-outline-variant/10">
           <div className="p-10 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className="p-3 bg-error-container text-error rounded-2xl"><Package size={24} /></div>
                 <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">Active Production Forecast</h3>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-outline-variant/10">
              {[
                { dish: 'Malai Kofta', orders: 420, trend: 'HIGH', students: 1200 },
                { dish: 'Butter Chicken', orders: 680, trend: 'CRITICAL', students: 1200 },
                { dish: 'Special Paneer Pulav', orders: 250, trend: 'LOW', students: 1200 },
                { dish: 'Garlic Naan', orders: 510, trend: 'MEDIUM', students: 1200 },
                { dish: 'Coconut Burfi', orders: 380, trend: 'MEDIUM', students: 1200 },
                { dish: 'Mixed Vegetable Curry', orders: 310, trend: 'LOW', students: 1200 },
              ].map((order, index) => (
                <div key={index} className="p-10 hover:bg-surface-container-low/40 transition-colors group">
                   <div className="flex items-center justify-between mb-8">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                        order.trend === 'CRITICAL' ? 'bg-red-100 text-red-600' : (order.trend === 'HIGH' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600')
                      )}>
                         {order.trend} LOAD
                      </span>
                      <ChevronRight size={18} className="text-on-surface-variant group-hover:translate-x-2 transition-transform" />
                   </div>
                   <h4 className="text-2xl font-black text-on-surface leading-tight mb-4">{order.dish}</h4>
                   <div className="flex items-baseline space-x-2">
                       <span className="text-4xl font-black text-primary">{order.orders}</span>
                       <span className="text-xs font-black text-on-surface-variant">Total Portions Required</span>
                   </div>
                   <div className="w-full bg-surface-container h-2 rounded-full mt-6 overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: `${(order.orders / order.students) * 100}%` }} />
                   </div>
                   <div className="flex items-center justify-between mt-3">
                      <p className="text-[10px] font-bold text-on-surface-variant">{Math.round((order.orders / order.students) * 100)}% Conversion</p>
                      <button className="text-[10px] font-black text-primary hover:underline">View Student List</button>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </AdminLayout>
  );
}
