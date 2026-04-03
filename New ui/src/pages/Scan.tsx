import React, { useState } from 'react';
import { 
  Camera, 
  BarChart2, 
  Scale, 
  Dumbbell, 
  Wheat, 
  Droplets,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Scan: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const handleIdentify = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Upload Zone */}
          <div className="flex flex-col gap-6">
            <div className="relative group h-96 border-2 border-dashed border-primary/30 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center text-center p-8 transition-all hover:border-primary/60 hover:bg-surface-container-highest cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="text-primary" size={40} />
              </div>
              <h3 className="text-xl font-headline font-extrabold text-primary mb-2">Drag & drop a food photo or click to upload</h3>
              <p className="text-on-surface-variant font-medium">or take a photo from your camera</p>
              <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
            </div>
          </div>

          {/* Right: Preview & Identification */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-[0px_12px_32px_rgba(27,28,25,0.06)] h-80 overflow-hidden group">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl_w3fUUUvMKU0wwyrl0O4dwK2_Ah4IfsDE9IBRqAc612XRYxo2JirW25R00BM7eAHXJZZx-fo3oJx7WUxruL_dlnc46tqaaZsfw5ULR1-2oOx7Z1K2HnEpOoFxR9A-3AYYoU1i56oHPDSClISkXa01e24SalygKzy3HF951J4ULP68LbD1IBJPN_yveq1sDVHE82xZvEGLEy9xF67ojLZ3gJSEhIBut9P6WItdOIgcnMclre4cQQtpbB0GBtp8NAua7vS-ONd2zT8" 
                alt="Uploaded Food" 
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={handleIdentify}
              disabled={isAnalyzing}
              className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-headline font-extrabold text-lg shadow-lg hover:shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <BarChart2 />
                </motion.div>
              ) : (
                <BarChart2 />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Identify Food'}
            </button>
          </div>
        </div>
      </section>

      {hasResult && (
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-outline-variant/15"
        >
          {/* Left: Ingredient Petal Chart */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-headline font-extrabold text-primary tracking-tight">Ingredient Harvest</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Accurate</span>
              </div>
            </div>
            
            <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center">
              <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 400 400">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#104715', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#b6f2ad', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#835500', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ffddb4', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#68253f', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ffb0c8', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <motion.path 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                  className="opacity-90" d="M200,200 Q200,100 280,100 Q360,100 200,200" fill="url(#grad1)" 
                />
                <motion.path 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                  className="opacity-90" d="M200,200 Q300,200 300,280 Q300,360 200,200" fill="url(#grad2)" 
                />
                <motion.path 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
                  className="opacity-90" d="M200,200 Q200,300 120,300 Q40,300 200,200" fill="url(#grad3)" 
                />
                <motion.path 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                  className="opacity-90" d="M200,200 Q100,200 100,120 Q100,40 200,200" fill="url(#grad1)" 
                />
              </svg>
              
              <div className="absolute w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVwLUypoxoUFGLc6HaqsQPt4G46LIbeZPMUaSLx79qf_82DJvtfxsrLlkOQhP1Y7eupR8783SwubGOyRb_UcwSsH6QE5s5DynXahCX7gRTbt7A9yeqXQNT2fm2zVL_3-9P-9yQAAOm3nnD9t_5hcrr7Xp2u4dR1i4U51CUZx16iY_36HumiTBdQGpdettjwJL3Jf-BDzOV1RInuAzF9jIYswCAbQk548jauKU2haA4-QZyJMlh4l3FVzKu5R-qvpWA1gSBNdkvjNJq" 
                  alt="Center" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="absolute top-[10%] right-[10%] text-right">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Avocado</p>
                <p className="text-lg font-headline font-extrabold text-primary">22%</p>
              </div>
              <div className="absolute bottom-[10%] right-[10%] text-right">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Salmon</p>
                <p className="text-lg font-headline font-extrabold text-secondary">35%</p>
              </div>
              <div className="absolute bottom-[10%] left-[10%] text-left">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Quinoa</p>
                <p className="text-lg font-headline font-extrabold text-tertiary">18%</p>
              </div>
              <div className="absolute top-[10%] left-[10%] text-left">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Leafy Greens</p>
                <p className="text-lg font-headline font-extrabold text-primary">25%</p>
              </div>
            </div>
          </div>

          {/* Right: Nutrition Data */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-8 rounded-3xl">
              <div className="mb-8">
                <span className="text-xs font-black text-secondary tracking-[0.2em] uppercase">Detected Selection</span>
                <h2 className="text-4xl font-headline font-extrabold text-primary mt-2">Mighty Harvest Bowl</h2>
                <div className="flex items-center gap-2 mt-2 text-on-surface-variant">
                  <Scale size={16} />
                  <span className="font-bold">Estimated Weight: 420g</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-8">
                <MacroCard icon={Dumbbell} label="Protein" value="32g" percent={40} color="bg-primary" />
                <MacroCard icon={Wheat} label="Carbs" value="45g" percent={35} color="bg-secondary" />
                <MacroCard icon={Droplets} label="Fats" value="24g" percent={25} color="bg-tertiary" />
              </div>

              <button className="w-full py-5 bg-primary text-white rounded-2xl font-headline font-extrabold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                <CheckCircle2 />
                Add to Meal Log
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

const MacroCard = ({ icon: Icon, label, value, percent, color }: { icon: any, label: string, value: string, percent: number, color: string }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
    <div className="flex items-center gap-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color.replace('bg-', 'text-').concat('/10'), color.replace('bg-', 'text-'))}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold text-on-surface-variant">{label}</p>
        <p className="text-lg font-headline font-extrabold text-on-surface">{value}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={cn("text-xl font-headline font-extrabold", color.replace('bg-', 'text-'))}>{percent}%</p>
      <div className="w-16 h-1 bg-surface-container rounded-full mt-1">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  </div>
);
