"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminMenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: dishes, isLoading } = useQuery({
    queryKey: ['admin-dishes'],
    queryFn: async () => {
      const { data } = await api.get('/api/menu/today'); 
      // Aggregate all dishes for management
      return Object.values(data).flat();
    },
    initialData: [] as any[]
  });

  const filteredDishes = dishes.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const [newDish, setNewDish] = useState({
     name: '',
     description: '',
     mealSlot: 'LUNCH',
     calories: 0,
     protein: 0,
     carbs: 0,
     fat: 0,
     isVeg: true
  });

  const addMutation = useMutation({
     mutationFn: (data: any) => api.post('/api/menu/dishes', data),
     onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-dishes'] });
        setIsModalOpen(false);
        toast.success("Dish added to official mess library.");
     }
  });

  return (
    <AdminLayout>
         <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
           <div>
              <h1 className="text-3xl font-black text-primary tracking-tight leading-none">Dish Repository</h1>
              <p className="text-[10px] font-black text-on-surface-variant mt-2 uppercase tracking-widest leading-none">Standardized Mess Menu Infrastructure</p>
           </div>
           
           <div className="flex items-center space-x-4">
              <div className="relative group">
                 <input 
                   type="text" 
                   placeholder="Search repository..." 
                            className="pl-12 pr-6 py-4 bg-surface-container-low rounded-3xl text-sm font-bold border-2 border-transparent focus:border-primary/15 outline-none w-80 transition-all"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
                         <Search className="absolute left-4 top-4.5 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white p-4 rounded-3xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center space-x-3"
              >
                 <Plus size={24} />
                 <span className="font-bold pr-2">Add New Dish</span>
              </button>
           </div>
        </div>

        {/* Dishes Table */}
        <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-outline-variant/10">
           <table className="w-full text-left">
              <thead className="bg-surface-container-low/60">
                 <tr>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Identified Preview</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Dish Specification</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Standard Slot</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nutrition (KCAL/P/C/F)</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Operations</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                 {filteredDishes.length > 0 ? filteredDishes.map((dish, i) => (
                    <tr key={i} className="hover:bg-surface-container-low/40 transition-all cursor-default">
                       <td className="px-10 py-8">
                          <div className="w-24 h-24 rounded-[32px] overflow-hidden bg-surface-container relative group">
                             <img src={dish.imageUrl || "/placeholder-dish.jpg"} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                             <div className={cn("absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-white", dish.isVeg ? "bg-green-500" : "bg-red-500")} />
                          </div>
                       </td>
                       <td className="px-10 py-8 max-w-xs">
                          <h4 className="text-xl font-black text-on-surface tracking-tight leading-none mb-2">{dish.name}</h4>
                          <p className="text-[10px] font-bold text-on-surface-variant line-clamp-2 leading-relaxed">{dish.description || "No official description set for this dish repository entry."}</p>
                       </td>
                       <td className="px-10 py-8">
                          <span className="text-[10px] font-black bg-surface-container text-on-surface-variant px-4 py-2 rounded-xl uppercase tracking-widest">
                             {dish.mealSlot}
                          </span>
                       </td>
                       <td className="px-10 py-8 font-mono">
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-on-surface leading-none">{dish.calories} <span className="text-[8px] opacity-40">KCAL</span></span>
                             <span className="text-[10px] font-bold text-on-surface-variant mt-1 tracking-tight">{dish.protein}P / {dish.carbs}C / {dish.fat}F</span>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex space-x-2">
                             <button className="p-3 bg-surface-container-low text-on-surface-variant rounded-2xl hover:bg-error-container hover:text-error transition-all"><Edit3 size={18} /></button>
                             <button className="p-3 bg-surface-container-low text-on-surface-variant rounded-2xl hover:bg-surface-container transition-all"><Trash2 size={18} /></button>
                          </div>
                       </td>
                    </tr>
                 )) : (
                    <tr><td colSpan={5} className="py-20 text-center font-black text-on-surface-variant uppercase tracking-widest text-xl opacity-40">The repository is currently empty.</td></tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* Add Modal */}
        <AnimatePresence>
           {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
                         <motion.div 
                   initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-surface-container-lowest w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl p-12 flex flex-col"
                 >
                    <div className="flex items-center justify-between mb-10">
                                  <h2 className="text-3xl font-black text-primary">Add New Dish Specification</h2>
                                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-surface-container rounded-2xl text-on-surface-variant"><X /></button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 overflow-y-auto pr-4 max-h-[70vh] no-scrollbar">
                       <div className="space-y-8">
                          <div className="aspect-video bg-surface-container-low rounded-[32px] flex flex-col items-center justify-center border-4 border-dashed border-outline-variant/20 group cursor-pointer hover:border-primary/30 transition-all">
                             <Camera size={48} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                             <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-4">Upload Official Image</span>
                          </div>
                          
                          <div className="space-y-6">
                             <div>
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 pl-2">Dish Name</label>
                                <input type="text" className="w-full bg-surface-container-low rounded-3xl p-5 text-sm font-bold border-2 border-transparent focus:border-primary/10 outline-none" placeholder="e.g. Garlic Herb Salmon" />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 pl-2">Description</label>
                                <textarea className="w-full bg-surface-container-low rounded-3xl p-5 text-sm font-bold border-2 border-transparent focus:border-primary/10 outline-none min-h-[120px]" placeholder="Brief context about flavors and allergens." />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="p-8 bg-surface-container-low rounded-[40px] space-y-8">
                             <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20 pb-4">Nutritional Standard</h4>
                             <div className="grid grid-cols-2 gap-6">
                                <div><label className="text-[9px] font-black opacity-40 block mb-1">CALORIES</label><input type="number" className="w-full bg-white rounded-2xl p-4 text-sm font-black border-none" defaultValue={0} /></div>
                                <div><label className="text-[9px] font-black opacity-40 block mb-1">PROTEIN (G)</label><input type="number" className="w-full bg-white rounded-2xl p-4 text-sm font-black border-none" defaultValue={0} /></div>
                                <div><label className="text-[9px] font-black opacity-40 block mb-1">CARBS (G)</label><input type="number" className="w-full bg-white rounded-2xl p-4 text-sm font-black border-none" defaultValue={0} /></div>
                                <div><label className="text-[9px] font-black opacity-40 block mb-1">FAT (G)</label><input type="number" className="w-full bg-white rounded-2xl p-4 text-sm font-black border-none" defaultValue={0} /></div>
                             </div>
                          </div>

                          <div className="space-y-4">
                             <button className="w-full py-5 bg-primary text-white rounded-3xl font-black text-lg transition-all shadow-xl shadow-primary/20">SAVE TO REPOSITORY</button>
                             <p className="text-center text-[10px] font-bold text-on-surface-variant px-10 leading-tight">By saving, you authorize this dish to be used across the MealOps ecosystem including mobile and scanning services.</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}
