"use client";

import React, { useState, useRef } from 'react';
import StudentLayout from '@/components/student/layout';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Loader2, Leaf, Zap, Brain, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ScanPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async (img: File) => {
      const formData = new FormData();
      formData.append('file', img);
      const { data } = await api.post('/api/scan/identify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    onSuccess: (data) => {
       toast.success(`Identified: ${data.foodName}!`);
    },
    onError: () => toast.error("Could not identify food. Please try with a clearer image.")
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
     setImage(null);
     setPreview(null);
     mutation.reset();
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Upload Interface */}
        <div className="space-y-8">
           <div className="space-y-4">
              <h1 className="text-3xl font-black text-on-surface">Visual Insights</h1>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                 Snap a photo of your tray to identify dishes and extract nutritional facts instantly. 
                 Our AI connects with both the mess database and the USDA library.
              </p>
           </div>

           <div 
             onClick={() => !preview && fileInputRef.current?.click()}
             className={cn(
               "relative h-96 rounded-[40px] border-4 border-dashed transition-all duration-500 overflow-hidden group cursor-pointer",
                      preview ? "border-transparent bg-white shadow-xl" : "border-outline-variant/30 bg-white/50 hover:border-primary/30 hover:bg-white"
             )}
           >
              <AnimatePresence mode="wait">
                 {!preview ? (
                    <motion.div 
                       key="empty"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6"
                    >
                       <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
                          <Camera size={40} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-lg font-black text-on-surface">Tap to Upload Photo</p>
                          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest leading-none">Drag & Drop supported</p>
                       </div>
                    </motion.div>
                 ) : (
                    <motion.div 
                       key="preview"
                       initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                       className="absolute inset-0"
                    >
                       <img src={preview} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/20" />
                       <button 
                         onClick={(e) => { e.stopPropagation(); removeImage(); }}
                         className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all shadow-xl"
                       >
                          <X size={20} />
                       </button>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           <input 
             ref={fileInputRef} type="file" accept="image/*" className="hidden" 
             onChange={handleFileChange} 
           />

           <div className="flex space-x-4">
              <button
                onClick={() => image && mutation.mutate(image)}
                disabled={!image || mutation.isPending}
                        className="flex-1 bg-primary text-white py-5 rounded-[24px] font-black text-lg transition-all hover:opacity-90 shadow-xl shadow-primary/20 disabled:opacity-30 disabled:shadow-none flex items-center justify-center space-x-3"
              >
                 {mutation.isPending ? <Loader2 className="animate-spin" /> : <Brain size={24} />}
                 <span>{mutation.isPending ? "IDENTIFYING..." : "ANALYZE PLATE"}</span>
              </button>
           </div>
        </div>

        {/* Right: Analysis Result */}
        <div className="space-y-8">
           <AnimatePresence mode="wait">
              {mutation.isSuccess ? (
                 <motion.div 
                   key="result"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-200 border border-outline-variant/15 flex flex-col h-full"
                 >
                    <div className="flex items-center space-x-4 mb-8">
                       <div className="p-3 bg-green-50 rounded-2xl"><CheckCircle2 className="text-green-600" /></div>
                       <div>
                          <h2 className="text-2xl font-black text-on-surface tracking-tight leading-none">{mutation.data.foodName}</h2>
                          <div className="flex items-center space-x-2 mt-1">
                             <span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded text-gray-500">{Math.round(mutation.data.confidence * 100)}% Match</span>
                             <span className="text-[10px] font-black bg-orange-100 px-2 py-0.5 rounded text-[#F5A623]">{mutation.data.weightEstimate}g Estimated</span>
                          </div>
                       </div>
                    </div>

                    {/* Petal Chart Placeholder (SVG) */}
                    <div className="relative h-64 flex items-center justify-center mb-8">
                       <div className="relative w-48 h-48">
                          { [0, 90, 180, 270].map((angle, i) => (
                             <motion.div 
                                key={angle}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                style={{ transform: `rotate(${angle}deg)` }}
                                className="absolute top-0 left-0 w-full h-full"
                             >
                                <div 
                                  className="w-20 h-20 rounded-[30px] rounded-bl-none shadow-md mt-4" 
                                  style={{ background: ['#2A5F2A', '#F5A623', '#2A5F2A88', '#F5A62388'][i] }} 
                                />
                             </motion.div>
                          )) }
                          <div className="absolute inset-0 bg-white w-20 h-20 rounded-full m-auto z-10 shadow-lg flex items-center justify-center flex-col">
                             <span className="text-xl font-black">{mutation.data.nutrition.calories}</span>
                             <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest leading-none">Cals</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-8">
                       {[
                          { l: 'Protein', v: mutation.data.nutrition.protein, c: 'text-blue-600', b: 'bg-blue-50' },
                          { l: 'Carbs', v: mutation.data.nutrition.carbs, c: 'text-green-600', b: 'bg-green-50' },
                          { l: 'Fat', v: mutation.data.nutrition.fat, c: 'text-orange-600', b: 'bg-orange-50' },
                       ].map(m => (
                          <div key={m.l} className={`${m.b} p-4 rounded-3xl text-center`}>
                             <div className="text-[10px] font-black uppercase text-on-surface-variant mb-1">{m.l}</div>
                             <div className={`${m.c} text-lg font-black leading-none`}>{m.v}g</div>
                          </div>
                       ))}
                    </div>

                    <button className="w-full mt-auto py-5 bg-primary text-white rounded-[24px] font-black text-lg transition-all hover:opacity-90 flex items-center justify-center space-x-2">
                       <PlusCircle size={24} />
                       <span>Confirm & Log Meal</span>
                    </button>
                 </motion.div>
              ) : (
                 <div className="h-full border-4 border-dashed border-outline-variant/20 rounded-[40px] flex flex-col items-center justify-center p-12 text-center text-on-surface-variant">
                    <Zap size={60} className="mb-6 opacity-20" />
                    <p className="font-bold text-lg">Detailed nutritional breakdown will appear here after analysis.</p>
                 </div>
              )}
           </AnimatePresence>
        </div>

      </div>
    </StudentLayout>
  );
}

function PlusCircle({ size }: { size: number }) {
  return <CheckCircle2 size={size} />;
}
