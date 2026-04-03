import React, { useState } from 'react';
import { 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplets,
  Calendar,
  TrendingUp,
  Search,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '../lib/utils';

export const Nutrition: React.FC = () => {
  const [activeRange, setActiveRange] = useState('Today');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  const trendData = [
    { name: 'Mon', actual: 1600, target: 2200 },
    { name: 'Tue', actual: 1800, target: 2200 },
    { name: 'Wed', actual: 1700, target: 2200 },
    { name: 'Thu', actual: 2000, target: 2200 },
    { name: 'Fri', actual: 1900, target: 2200 },
    { name: 'Sat', actual: 2100, target: 2200 },
    { name: 'Sun', actual: 1840, target: 2200 },
  ];

  const macroData = [
    { name: 'Mon', protein: 120, carbs: 160, fats: 90 },
    { name: 'Tue', protein: 140, carbs: 150, fats: 80 },
    { name: 'Wed', protein: 110, carbs: 180, fats: 100 },
    { name: 'Thu', protein: 130, carbs: 140, fats: 70 },
    { name: 'Fri', protein: 150, carbs: 170, fats: 110 },
    { name: 'Sat', protein: 100, carbs: 120, fats: 60 },
    { name: 'Sun', protein: 145, carbs: 130, fats: 85 },
  ];

  const history = [
    { date: 'Oct 24, 2023', time: '08:15 AM', type: 'Breakfast', dish: 'Scrambled Eggs, Whole Wheat Toast, Avocado', kcal: 420, p: 24, c: 32, f: 18, feedback: '😋' },
    { date: 'Oct 24, 2023', time: '01:30 PM', type: 'Lunch', dish: 'Grilled Chicken Bowl, Quinoa, Mixed Greens', kcal: 680, p: 52, c: 45, f: 14, feedback: '🥗' },
    { date: 'Oct 23, 2023', time: '08:00 PM', type: 'Dinner', dish: 'Pan-Seared Salmon, Asparagus, Sweet Potato', kcal: 540, p: 38, c: 30, f: 22, feedback: '✨' },
    { date: 'Oct 23, 2023', time: '04:45 PM', type: 'Snack', dish: 'Greek Yogurt with Berries and Honey', kcal: 210, p: 12, c: 25, f: 5, feedback: '🫐' },
  ];

  return (
    <div className="px-10 py-4 space-y-10">
      {/* Date Range Selector */}
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex bg-surface-container-low p-1.5 rounded-2xl">
            {['Today', 'Week', 'Month', 'Custom'].map((range) => (
              <button 
                key={range}
                onClick={() => setActiveRange(range)}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeRange === range 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-primary font-bold">
            <Calendar size={18} />
            <span className="text-sm">
              {activeRange === 'Custom' && customDateRange.start && customDateRange.end 
                ? `${customDateRange.start} — ${customDateRange.end}`
                : "October 24, 2023"}
            </span>
          </div>
        </div>

        {activeRange === 'Custom' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-low p-6 rounded-3xl flex flex-wrap items-end gap-6 border border-outline-variant/10"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Start Date</label>
              <input 
                type="date" 
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-white border-none rounded-xl px-4 py-2 text-sm font-bold text-primary focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="pb-2">
              <ArrowRight size={20} className="text-on-surface-variant/30" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">End Date</label>
              <input 
                type="date" 
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-white border-none rounded-xl px-4 py-2 text-sm font-bold text-primary focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <button className="bg-primary text-white px-8 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
              <Search size={16} />
              Fetch Data
            </button>
          </motion.div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="CALORIES" value="1,840" goal="2,200" icon={Flame} color="text-primary" />
        <StatCard label="PROTEIN" value="124g" goal="150" icon={Dumbbell} color="text-secondary" />
        <StatCard label="CARBS" value="210g" goal="250" icon={Wheat} color="text-tertiary" />
        <StatCard label="FAT" value="52g" goal="65" icon={Droplets} color="text-tertiary" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Macro Donut */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(27,28,25,0.06)] flex flex-col items-center text-center">
          <h4 className="font-headline font-extrabold text-xl text-primary mb-8 self-start">Daily Composition</h4>
          <div className="relative w-64 h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Protein', value: 30, color: '#104715' },
                    { name: 'Carbs', value: 45, color: '#835500' },
                    { name: 'Fats', value: 25, color: '#68253f' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[{ color: '#104715' }, { color: '#835500' }, { color: '#68253f' }].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Intake</span>
              <span className="text-3xl font-headline font-extrabold text-primary">83%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <LegendItem color="bg-primary" label="Protein (30%)" />
            <LegendItem color="bg-secondary" label="Carbs (45%)" />
            <LegendItem color="bg-tertiary" label="Fats (25%)" />
          </div>
        </div>

        {/* Intake Trend */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(27,28,25,0.06)] min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-headline font-extrabold text-xl text-primary">Caloric Intake Trend</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="text-xs font-semibold text-on-surface-variant">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-surface-container-high"></span>
                <span className="text-xs font-semibold text-on-surface-variant">Target</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#104715" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#104715" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0eee9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#41493f' }} dy={10} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="actual" stroke="#104715" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="target" stroke="#c1c9bb" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Macro Bar Chart */}
      <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(27,28,25,0.06)]">
        <h4 className="font-headline font-extrabold text-xl text-primary mb-10">Macro Breakdown by Day</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={macroData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#41493f' }} dy={10} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="protein" fill="#104715" radius={[4, 4, 0, 0]} />
              <Bar dataKey="carbs" fill="#835500" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fats" fill="#68253f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Meal History */}
      <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0px_12px_32px_rgba(27,28,25,0.06)] overflow-hidden">
        <div className="p-8 border-b border-surface-container-high">
          <h4 className="font-headline font-extrabold text-xl text-primary">Recent Meal History</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Date / Time</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Meal Type</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Dishes Eaten</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Calories</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Macros (P/C/F)</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {history.map((row, i) => (
                <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-sm">{row.date}</p>
                    <p className="text-xs text-on-surface-variant">{row.time}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase",
                      row.type === 'Breakfast' && "bg-primary/10 text-primary",
                      row.type === 'Lunch' && "bg-secondary/10 text-secondary",
                      row.type === 'Dinner' && "bg-tertiary/10 text-tertiary",
                      row.type === 'Snack' && "bg-surface-container-high text-on-surface-variant"
                    )}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium">{row.dish}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold">{row.kcal} kcal</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <span className="text-[11px] font-bold text-primary">{row.p}g</span>
                      <span className="text-[11px] font-bold text-secondary">{row.c}g</span>
                      <span className="text-[11px] font-bold text-tertiary">{row.f}g</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-xl">{row.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 text-center border-t border-surface-container-high">
          <button className="text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4">View Complete History Archive</button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, goal, icon: Icon, color }: any) => {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const numericGoal = parseFloat(goal.replace(/[^0-9.]/g, ''));
  const percentage = Math.min((numericValue / numericGoal) * 100, 100);

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(27,28,25,0.04)] flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-start">
        <span className="text-on-surface-variant font-bold text-sm tracking-tight">{label}</span>
        <div className={cn("p-2 rounded-lg", color.replace('text-', 'bg-').concat('/10'), color)}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className={cn("text-4xl font-headline font-extrabold tracking-tighter", color)}>{value}</h3>
        <p className="text-xs text-on-surface-variant mt-1 font-semibold">Goal: {goal}</p>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={cn("h-full rounded-full", color.replace('text-', 'bg-'))} 
          />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-2">
    <div className={cn("w-3 h-3 rounded-full", color)}></div>
    <span className="text-xs font-bold text-on-surface-variant uppercase">{label}</span>
  </div>
);
