import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Sunrise,
  Sun,
  Moon,
  Info,
  Heart,
  Smile,
  Meh,
  Frown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const MealLog: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Lunch']);
  const [mealStates, setMealStates] = useState<Record<string, { status: string, rating: string | null }>>({
    'Grilled Paneer Salad': { status: 'Ate', rating: '😍' },
    'Lentil Consommé': { status: 'Skip', rating: null },
  });

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const updateMealStatus = (name: string, status: string) => {
    setMealStates(prev => ({
      ...prev,
      [name]: { ...prev[name], status }
    }));
  };

  const updateMealRating = (name: string, rating: string) => {
    setMealStates(prev => ({
      ...prev,
      [name]: { ...prev[name], rating }
    }));
  };

  return (
    <div className="px-10 pb-32">
      {/* Nutrition Total Bar */}
      <section className="mt-4 mb-10 bg-surface-container-low p-8 rounded-[2rem]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-primary font-extrabold text-lg mb-1">Daily Energy Quota</h3>
            <p className="text-on-surface-variant text-sm">You have <span className="text-secondary font-bold">840 kcal</span> remaining for today</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-primary tracking-tighter">1,260</span>
            <span className="text-on-surface-variant font-bold">/ 2,100 kcal</span>
          </div>
        </div>
        <div className="h-4 w-full bg-surface-container-high rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" 
          />
        </div>
        <div className="flex gap-8 mt-6">
          <NutrientLegend color="bg-primary" label="Protein: 85g / 120g" />
          <NutrientLegend color="bg-secondary" label="Carbs: 140g / 250g" />
          <NutrientLegend color="bg-tertiary" label="Fats: 42g / 70g" />
        </div>
      </section>

      {/* Log Sections */}
      <div className="space-y-6">
        {/* Breakfast Card */}
        <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0px_12px_32px_rgba(27,28,25,0.06)] border-2 border-primary/5">
          <div 
            className="p-6 flex justify-between items-center bg-secondary-fixed/10 cursor-pointer"
            onClick={() => toggleSection('Breakfast')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <Sunrise size={24} />
              </div>
              <div>
                <h4 className="font-bold text-primary text-xl">Breakfast</h4>
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">07:30 AM • 420 kcal logged</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low">
              {expandedSections.includes('Breakfast') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          <AnimatePresence>
            {expandedSections.includes('Breakfast') && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 space-y-8">
                  <MealItem 
                    name="Artisan Avocado Toast" 
                    kcal="420 kcal • Fiber Rich" 
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuDsB3O-EF_7tO_-_hOun-2rR0fTgynRhIP_En5pDOJH7oYv8UPO9G_hUh2fsedqfIryc-lKygNOSqi8ol7IefyNlXdTkAGixgf_qsE_DIFsT239idmgx9QM4bgzNUU2uDZ1a4LMqaBJNmy50t2pE9Mb4uuKgAfkwdaHu1QLtPMBilheu5UOzZnJmWa_AR2Shgj8Bz_tHJKNSYnTW2jH_qt2CD_qMRH8wC0HSBFzgIXfk2aZYZ7Za0rEaVFeqf57x8QY118i_Z6dvQ9L"
                    status={mealStates['Artisan Avocado Toast']?.status || 'Ate'}
                    rating={mealStates['Artisan Avocado Toast']?.rating}
                    onStatusChange={(s: string) => updateMealStatus('Artisan Avocado Toast', s)}
                    onRatingChange={(r: string) => updateMealRating('Artisan Avocado Toast', r)}
                    showFeedback
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lunch Card */}
        <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0px_12px_32px_rgba(27,28,25,0.06)] border-2 border-primary/5">
          <div 
            className="p-6 flex justify-between items-center bg-primary/5 cursor-pointer"
            onClick={() => toggleSection('Lunch')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                <Sun size={24} fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-primary text-xl">Lunch</h4>
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">12:45 PM • 840 kcal target</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              {expandedSections.includes('Lunch') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          <AnimatePresence>
            {expandedSections.includes('Lunch') && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 space-y-8">
                  <MealItem 
                    name="Grilled Paneer Salad" 
                    kcal="320 kcal • High Protein" 
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuC4ttsCdBamjoNMzgqFLsGw8-bMiDn_A8JMyRUMM-IOJBpFcDJs7pYA4x6WiJEgis3jk9qBXgyQz5xw5qJfhnCt19Sp1WZLMqf2lNHSHhUIFvbodTkobFrGwiGBZ8SCdWcKkEpo_4FWFRyGmzF82dsA8-3HeKjbxzXkjMbSkfxrlVuOlgOf4FI7NptDePEwRVeqKRlCaB2lm7wqS5HCYzV_Fhck7wKPzk7E32o9joh9ceb5jnwDM2Clum9ULOGjoZCqP3GXwFzyO3Y1"
                    status={mealStates['Grilled Paneer Salad']?.status || 'Ate'}
                    rating={mealStates['Grilled Paneer Salad']?.rating}
                    onStatusChange={(s: string) => updateMealStatus('Grilled Paneer Salad', s)}
                    onRatingChange={(r: string) => updateMealRating('Grilled Paneer Salad', r)}
                    showFeedback
                  />
                  <div className="h-px bg-outline-variant/15 ml-[84px]"></div>
                  <MealItem 
                    name="Lentil Consommé" 
                    kcal="180 kcal • Fiber Rich" 
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuBoRJp-zefLeBQi1xvhvRupfBjyJ1PxMBSuxgu7FEjXRq12hBGnueGl_cIQcC1eiheAAboJIyia4WThHHQ5AFMKdPOLdsg7zD7A4wYowaGq9IvQkn2PYZccnBOLsUyfl0ItOj6kHzSwCZxzX09gFY_PRI4rTTAdgYjVKUZNXrC5Bc-2YXIzpnZV-R38xRHrIOXf4LTPH1f4iQs6LTv6O4LXX-ZWYc--Wk2tRWVKZLYdZ_bnunf1OLJaTsTI4bwX2esnnHFj4obNPd-Q"
                    status={mealStates['Lentil Consommé']?.status || 'Skip'}
                    rating={mealStates['Lentil Consommé']?.rating}
                    onStatusChange={(s: string) => updateMealStatus('Lentil Consommé', s)}
                    onRatingChange={(r: string) => updateMealRating('Lentil Consommé', r)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dinner Card */}
        <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0px_12px_32px_rgba(27,28,25,0.06)] border-2 border-primary/5">
          <div 
            className="p-6 flex justify-between items-center bg-tertiary-fixed/10 cursor-pointer"
            onClick={() => toggleSection('Dinner')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                <Moon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-primary text-xl">Dinner</h4>
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">Upcoming • 720 kcal planned</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low">
              {expandedSections.includes('Dinner') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          <AnimatePresence>
            {expandedSections.includes('Dinner') && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 space-y-8">
                  <MealItem 
                    name="Garden Basil Pesto" 
                    kcal="520 kcal • Whole Grain" 
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuAjNdnPVkXdSoACdfS7MBCyq3op57Yi_UmKR3LRePkAzL4X6VW0DjdOK610RgXTJELZLCZwJwAvEArK-ngYfsDWGl5uP8EsvxTrin_Reg4txpS5s9rl-hRgNfgVAYFKM8OIJj9xeQhl8MhXIOyxff-EPYQqZoJrkS6He4RXd4qNm8Wq7uVg_VNsQnnlKl_8yPYSlFESob1HhaczkEczQ7aHDVGR1Fp_-DEGXxYnmVVEgF4-tT1XCTANvH-jIcpQfWzYCD5VZ7mOebiM"
                    status={mealStates['Garden Basil Pesto']?.status || 'Ate'}
                    rating={mealStates['Garden Basil Pesto']?.rating}
                    onStatusChange={(s: string) => updateMealStatus('Garden Basil Pesto', s)}
                    onRatingChange={(r: string) => updateMealRating('Garden Basil Pesto', r)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 right-0 w-[calc(100%-16rem)] bg-white/80 backdrop-blur-xl py-6 px-10 flex justify-between items-center z-40 border-t border-outline-variant/10">
        <div className="flex items-center gap-4">
          <Info className="text-primary" size={20} />
          <p className="text-sm text-on-surface-variant font-medium">Your metabolic rate is 15% higher today. Fuel accordingly.</p>
        </div>
        <button className="bg-gradient-to-br from-primary to-primary-container text-white px-12 py-4 rounded-[1.5rem] font-bold text-lg shadow-[0px_8px_24px_rgba(16,71,21,0.2)] hover:scale-[1.02] active:scale-95 transition-all">
          Submit Log
        </button>
      </footer>
    </div>
  );
};

const NutrientLegend = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={cn("w-2 h-2 rounded-full", color)}></div>
    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
  </div>
);

const LogSection = ({ icon: Icon, title, subtitle, color, textColor, isExpanded, onToggle }: any) => (
  <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0px_12px_32px_rgba(27,28,25,0.04)]">
    <div 
      className="p-6 flex justify-between items-center bg-surface-container-low/30 cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", color, textColor)}>
          <Icon size={24} />
        </div>
        <div>
          <h4 className="font-bold text-primary text-xl">{title}</h4>
          <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low">
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
    </div>
  </div>
);

const MealItem = ({ name, kcal, image, status, rating, onStatusChange, onRatingChange, showFeedback }: any) => (
  <div className={cn("flex items-center justify-between", status === 'Skip' && "opacity-60 grayscale-[0.5]")}>
    <div className="flex items-center gap-5">
      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-surface-container-low">
        <img src={image} className="w-full h-full object-cover" alt={name} referrerPolicy="no-referrer" />
      </div>
      <div>
        <h5 className="font-bold text-primary text-lg">{name}</h5>
        <p className="text-on-surface-variant text-sm font-medium">{kcal}</p>
      </div>
    </div>
    <div className="flex flex-col items-end gap-4">
      <div className="flex bg-surface-container-low p-1 rounded-full">
        {['Ate', 'Half', 'Skip'].map((s) => (
          <button 
            key={s}
            onClick={() => onStatusChange(s)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all",
              status === s 
                ? (s === 'Skip' ? "bg-error text-white" : "bg-primary text-white shadow-sm")
                : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {s}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-6">
            <span className="text-xs font-black text-on-surface-variant uppercase tracking-tighter">How was it?</span>
            <div className="flex gap-4">
              {['😍', '😊', '😐', '😞'].map((emoji) => (
                <button 
                  key={emoji}
                  onClick={() => onRatingChange(emoji)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform",
                    rating === emoji ? "bg-primary/10 ring-2 ring-primary" : "bg-surface-container-low"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <input 
            className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all placeholder:text-on-surface-variant/50" 
            placeholder="Add a comment or note..." 
            type="text"
          />
        </div>
      )}
    </div>
  </div>
);
