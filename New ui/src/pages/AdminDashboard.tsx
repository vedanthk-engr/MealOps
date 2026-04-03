import React from 'react';
import { 
  Users, 
  ShoppingBasket, 
  AlertTriangle, 
  Star,
  TrendingUp,
  Download,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../lib/utils';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Students Logged Today', value: '1,284', trend: '+12%', icon: Users, color: 'text-primary', bg: 'bg-primary-fixed' },
    { label: 'Total Pre-Orders', value: '842', icon: ShoppingBasket, color: 'text-secondary', bg: 'bg-secondary-fixed' },
    { label: 'Predicted Wastage', value: '4.2', unit: 'kg', icon: AlertTriangle, color: 'text-error', bg: 'bg-error-container' },
    { label: 'Avg Satisfaction', value: '4.8', icon: Star, color: 'text-secondary', bg: 'bg-secondary-fixed', filled: true },
  ];

  const trendData = [
    { name: 'Mon', paneer: 3.5, butter: 3.8 },
    { name: 'Tue', paneer: 4.2, butter: 3.5 },
    { name: 'Wed', paneer: 3.8, butter: 3.2 },
    { name: 'Thu', paneer: 4.5, butter: 4.0 },
    { name: 'Fri', paneer: 4.0, butter: 3.8 },
    { name: 'Sat', paneer: 4.8, butter: 4.2 },
    { name: 'Sun', paneer: 4.6, butter: 4.5 },
  ];

  const recommendations = [
    { name: 'Mutton Rogan Josh', orders: 420, rate: 94, recommended: 450, risk: 'Low' },
    { name: 'Seasonal Stir Fry', orders: 180, rate: 62, recommended: 210, risk: 'Medium' },
    { name: 'Curd Rice', orders: 510, rate: 48, recommended: 550, risk: 'High' },
    { name: 'Garlic Naan', orders: 680, rate: 88, recommended: 720, risk: 'Low' },
  ];

  return (
    <div className="p-10 space-y-10">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0px_12px_32px_rgba(27,28,25,0.04)] border border-outline-variant/10"
          >
            <p className="text-on-surface-variant text-sm font-medium mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <h3 className={cn("text-3xl font-headline font-extrabold tracking-tight", stat.color)}>{stat.value}</h3>
                {stat.unit && <span className="text-sm font-bold text-on-surface-variant">{stat.unit}</span>}
              </div>
              {stat.trend ? (
                <div className="flex items-center text-on-primary-fixed-variant font-bold text-sm bg-primary-fixed px-2 py-1 rounded-lg">
                  <TrendingUp size={14} className="mr-1" />
                  {stat.trend}
                </div>
              ) : (
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", stat.bg)}>
                  <stat.icon size={20} className={stat.color} fill={stat.filled ? 'currentColor' : 'none'} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pre-Orders Per Dish */}
        <div className="bg-surface-container-low p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-headline font-extrabold text-primary">Pre-Orders Per Dish</h4>
              <p className="text-sm text-on-surface-variant">Today's Lunch Allocation</p>
            </div>
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
              <MoreVertical size={20} className="text-on-surface-variant" />
            </button>
          </div>
          <div className="space-y-6">
            <AllocationBar label="Paneer Tikka" value={312} percent={85} />
            <AllocationBar label="Dal Tadka" value={245} percent={65} />
            <AllocationBar label="Mixed Veg Curry" value={168} percent={45} />
            <AllocationBar label="Butter Chicken" value={340} percent={92} />
          </div>
        </div>

        {/* Satisfaction Trend */}
        <div className="bg-surface-container-low p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-headline font-extrabold text-primary">Satisfaction Trend</h4>
              <p className="text-sm text-on-surface-variant">Top 5 Dishes (7 Days)</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Paneer</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Butter Chk</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c1c9bb" strokeOpacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#41493f' }} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="paneer" stroke="#104715" strokeWidth={3} dot={{ r: 4, fill: '#104715' }} />
                <Line type="monotone" dataKey="butter" stroke="#835500" strokeWidth={3} dot={{ r: 4, fill: '#835500' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendation Table */}
      <section className="bg-surface-container-lowest rounded-[2rem] shadow-[0px_24px_48px_rgba(27,28,25,0.04)] overflow-hidden border border-outline-variant/10">
        <div className="p-8 flex items-center justify-between bg-white">
          <div>
            <h4 className="text-2xl font-headline font-extrabold text-primary">Cooking Recommendations for Tomorrow</h4>
            <p className="text-sm text-on-surface-variant">Based on historical eat rates and live pre-order forecasts</p>
          </div>
          <button className="bg-surface-container-low text-primary px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-surface-container-high transition-all active:scale-95">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                <th className="px-8 py-5 text-xs font-black text-on-surface-variant uppercase tracking-widest">Dish Name</th>
                <th className="px-8 py-5 text-xs font-black text-on-surface-variant uppercase tracking-widest">Expected Pre-Orders</th>
                <th className="px-8 py-5 text-xs font-black text-on-surface-variant uppercase tracking-widest">Historical Eat Rate</th>
                <th className="px-8 py-5 text-xs font-black text-on-surface-variant uppercase tracking-widest">Recommended Portions</th>
                <th className="px-8 py-5 text-xs font-black text-on-surface-variant uppercase tracking-widest">Wastage Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {recommendations.map((rec) => (
                <tr key={rec.name} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-6 font-bold text-on-surface">{rec.name}</td>
                  <td className="px-8 py-6 text-on-surface-variant">{rec.orders}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={cn(
                          "h-full rounded-full",
                          rec.rate > 80 ? "bg-primary" : rec.rate > 50 ? "bg-secondary" : "bg-error"
                        )} style={{ width: `${rec.rate}%` }}></div>
                      </div>
                      <span className="text-xs font-bold">{rec.rate}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-primary text-lg">{rec.recommended}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      rec.risk === 'Low' && "bg-primary-fixed text-on-primary-fixed-variant",
                      rec.risk === 'Medium' && "bg-secondary-fixed text-on-secondary-fixed-variant",
                      rec.risk === 'High' && "bg-error-container text-on-error-container"
                    )}>
                      {rec.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="p-10 text-center">
        <p className="text-on-surface-variant/40 text-xs font-bold uppercase tracking-[0.2em]">The Editorial Harvest © 2024 • Intelligence for a Sustainable Kitchen</p>
      </footer>
    </div>
  );
};

const AllocationBar = ({ label, value, percent }: any) => (
  <div className="flex items-center gap-4">
    <span className="w-24 text-xs font-bold text-on-surface-variant truncate">{label}</span>
    <div className="flex-1 h-8 bg-surface-container-highest rounded-lg overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        className="h-full bg-gradient-to-br from-primary to-primary-container" 
      />
    </div>
    <span className="text-xs font-black text-primary">{value}</span>
  </div>
);
