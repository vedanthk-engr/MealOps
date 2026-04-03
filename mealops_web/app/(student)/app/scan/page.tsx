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
      <div className="max-w-7xl mx-auto px-8 lg:px-16 pt-12 pb-40 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left: Upload Interface */}
          <div className="space-y-12 h-full">
            <div className="space-y-6">
              <h1 className="text-8xl font-black text-on-surface tracking-tighter leading-[0.8]">Optical<br/>Harvest.</h1>
              <p className="text-sm font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 italic">Snap a photo to deconstruct nutritional flux.</p>
            </div>

            <div 
              onClick={() => !preview && fileInputRef.current?.click()}
              className={cn(
                "relative h-[500px] rounded-[4rem] border-[8px] border-surface-container-high transition-all duration-700 overflow-hidden group cursor-pointer shadow-[0px_32px_84px_rgba(27,28,25,0.05)]",
                preview ? "border-white bg-white" : "bg-white/50 hover:bg-white hover:border-primary/10"
              )}
            >
              <AnimatePresence mode="wait">
                {!preview ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-700">
                      <Camera size={48} />
                    </div>
                    <div className="mt-8 space-y-2">
                       <p className="text-2xl font-black text-on-surface tracking-tight">Initiate Scan</p>
                       <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none opacity-40">Capture the harvest through your lens</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="preview"
                    initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0"
                  >
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute top-8 right-8 p-4 bg-white/10 backdrop-blur-3xl rounded-full text-white hover:bg-white/30 transition-all shadow-2xl border border-white/20"
                    >
                      <X size={24} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <input 
              ref={fileInputRef} type="file" accept="image/*" className="hidden" 
              onChange={handleFileChange} 
            />

            <div className="flex">
              <button
                onClick={() => image && mutation.mutate(image)}
                disabled={!image || mutation.isPending}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/30 disabled:opacity-30 disabled:scale-100 flex items-center justify-center space-x-4"
              >
                {mutation.isPending ? <Loader2 className="animate-spin" /> : <Brain size={24} />}
                <span>{mutation.isPending ? "DECONSTRUCTING..." : "COMMIT TO ANALYSIS"}</span>
              </button>
            </div>
          </div>

          {/* Right: Analysis Result */}
          <div className="h-full">
            <AnimatePresence mode="wait">
              {mutation.isSuccess ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container-lowest rounded-[4rem] p-12 shadow-[0px_48px_96px_rgba(27,28,25,0.08)] border-0 flex flex-col h-full sticky top-32"
                >
                  <div className="flex items-center justify-between mb-12">
                     <div className="flex items-center space-x-6">
                        <div className="p-4 bg-primary text-white rounded-[1.5rem] shadow-xl shadow-primary/20"><CheckCircle2 size={28} /></div>
                        <div>
                           <h2 className="text-4xl font-black text-on-surface tracking-tighter leading-none">{mutation.data.foodName}.</h2>
                           <div className="flex items-center space-x-3 mt-3">
                              <span className="text-[10px] font-black bg-surface-container px-3 py-1.5 rounded-full text-on-surface-variant uppercase tracking-widest">{Math.round(mutation.data.confidence * 100)}% Certainty</span>
                              <span className="text-[10px] font-black bg-secondary/10 px-3 py-1.5 rounded-full text-secondary uppercase tracking-widest">{mutation.data.weightEstimate}g Dynamic Estimate</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Metabolic Flower Chart */}
                  <div className="relative h-[25rem] flex items-center justify-center mb-12">
                    <div className="relative w-64 h-64">
                      { [0, 90, 180, 270].map((angle, i) => (
                        <motion.div 
                          key={angle}
                          initial={{ scale: 0, rotate: angle - 45 }}
                          animate={{ scale: 1, rotate: angle }}
                          transition={{ delay: 0.2 + (i * 0.1), type: 'spring' }}
                          className="absolute top-0 left-0 w-full h-full origin-center"
                        >
                          <div 
                            className="w-24 h-24 rounded-[3rem] rounded-bl-none shadow-xl mt-4 opacity-80" 
                            style={{ background: ['#104715', '#feae2c', '#104715cc', '#feae2ccc'][i] }} 
                          />
                        </motion.div>
                      )) }
                      <div className="absolute inset-0 bg-white w-28 h-28 rounded-full m-auto z-10 shadow-2xl flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-on-surface tracking-tighter">{mutation.data.nutrition.calories}</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] leading-none opacity-40">KCALS</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-12">
                    {[
                      { l: 'Protein', v: mutation.data.nutrition.protein, c: 'text-primary', b: 'bg-primary/5' },
                      { l: 'Carbs', v: mutation.data.nutrition.carbs, c: 'text-secondary', b: 'bg-secondary/10' },
                      { l: 'Lipids', v: mutation.data.nutrition.fat, c: 'text-tertiary', b: 'bg-tertiary/10' },
                    ].map(m => (
                      <div key={m.l} className={`${m.b} p-8 rounded-[2.5rem] text-center group/card transition-all hover:scale-105 shadow-sm`}>
                        <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 opacity-50">{m.l}</div>
                        <div className={`${m.c} text-2xl font-black tracking-tighter`}>{m.v}g</div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-auto py-6 bg-gradient-to-br from-primary to-primary-container text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/30 flex items-center justify-center space-x-3">
                    <CheckCircle2 size={24} />
                    <span>Archive Intake Stats</span>
                  </button>
                </motion.div>
              ) : (
                <div className="h-full bg-surface-container-low rounded-[4rem] flex flex-col items-center justify-center p-20 text-center opacity-30">
                  <Zap size={80} className="mb-8" />
                  <p className="font-black text-sm uppercase tracking-[0.3em] leading-relaxed">System in anticipation.<br/>Analysis pending visual commit.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </StudentLayout>
  );
}
