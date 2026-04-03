import React, { useState } from 'react';
import { 
  Flame, 
  Egg, 
  Wheat, 
  Droplets, 
  CheckCircle2, 
  ArrowRight, 
  Scan, 
  BookOpen,
  Leaf,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { MENU_ITEMS } from '../constants';
import { User } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [selectedMealCategory, setSelectedMealCategory] = useState('Lunch');
  const [preOrderItems, setPreOrderItems] = useState([
    { name: 'Spicy Tofu Stir Fry', time: 'Lunch', kcal: 450, checked: true },
    { name: 'Masala Dosa (Special)', time: 'Breakfast', kcal: 320, checked: false },
    { name: 'Greek Salad & Pita', time: 'Dinner', kcal: 280, checked: false },
  ]);

  const stats = [
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
    <div className="grid grid-cols-12 gap-8 items-start">
      {/* Left & Center Column */}
      <div className="col-span-8 space-y-10">
        {/* Stats Row */}
        <section className="grid grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0px_12px_32px_rgba(27,28,25,0.04)]"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={stat.color + " " + stat.bg + " p-2 rounded-xl"} size={36} />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Goal: {stat.goal}</span>
              </div>
              <p className="text-2xl font-black text-on-surface">{stat.value}</p>
              <p className="text-xs font-semibold text-on-surface-variant">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        {/* Today's Harvest */}
        <section>
          <div className="flex items-end justify-between mb-8">
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
                    "px-6 py-2 rounded-lg text-sm font-extrabold transition-all",
                    selectedMealCategory === cat 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {MENU_ITEMS.filter(item => item.category === selectedMealCategory).map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary tracking-wider">
                    {item.calories} KCAL
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-extrabold text-on-surface leading-tight">{item.name}</h4>
                    <Leaf size={16} className="text-primary fill-primary/20" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-surface-container">
                    <button className="text-xs font-bold text-primary underline underline-offset-4 hover:opacity-70 transition-opacity">Details</button>
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

      {/* Right Column */}
      <div className="col-span-4 space-y-8">
        {/* Nutrition Donut */}
        <div className="bg-white p-8 rounded-2xl shadow-[0px_12px_32px_rgba(27,28,25,0.06)] border border-outline-variant/5">
          <h3 className="text-xl font-extrabold text-on-surface mb-6">Today's Nutrition</h3>
          <div className="relative flex justify-center items-center h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nutritionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
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
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-xs font-bold text-on-surface-variant">Calories</span>
              </div>
              <span className="text-xs font-black">1840 / 2400</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-xs font-bold text-on-surface-variant">Protein</span>
              </div>
              <span className="text-xs font-black">112g / 140g</span>
            </div>
          </div>
        </div>

        {/* Pre-Order Panel */}
        <div className="bg-primary p-8 rounded-2xl shadow-xl text-white">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart size={20} />
            <h3 className="text-xl font-extrabold tracking-tight">Pre-Order Tomorrow</h3>
          </div>
          <div className="space-y-6">
            {preOrderItems.map((item) => (
              <div key={item.name} className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-[10px] text-white/60">{item.time} • {item.kcal} kcal</p>
                </div>
                <div 
                  onClick={() => {
                    setPreOrderItems(prev => prev.map(p => 
                      p.name === item.name ? { ...p, checked: !p.checked } : p
                    ));
                  }}
                  className={cn(
                    "w-11 h-6 rounded-full relative transition-colors cursor-pointer",
                    item.checked ? "bg-secondary" : "bg-white/20"
                  )}
                >
                  <div className={cn(
                    "absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform",
                    item.checked && "translate-x-5"
                  )} />
                </div>
              </div>
            ))}
            <button className="w-full py-4 mt-4 bg-secondary text-on-secondary-fixed font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all">
              Confirm Order
            </button>
          </div>
        </div>

        {/* Wellness Tip */}
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

      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 group z-50">
        <Scan size={32} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
