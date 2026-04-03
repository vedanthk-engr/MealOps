import React from 'react';
import { 
  Home, 
  UtensilsCrossed, 
  QrCode, 
  History, 
  ShoppingCart, 
  BarChart3, 
  User, 
  ShieldCheck 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { User as UserType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserType;
  onRoleSwitch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onRoleSwitch }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'scan', label: 'Scan', icon: QrCode },
    { id: 'meal-log', label: 'Meal Log', icon: History },
    { id: 'pre-order', label: 'Pre-Order', icon: ShoppingCart },
    { id: 'nutrition', label: 'Nutrition', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-outline-variant/15 glass-nav flex flex-col py-8 px-6 z-50">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-black text-primary tracking-tighter">MealOps</h1>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">VIT Smart Mess</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-surface-container-low text-primary font-bold border-r-4 border-primary"
                  : "text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              <Icon size={20} className={cn(isActive && "fill-primary/20")} />
              <span className="font-headline tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/10">
        <button
          onClick={onRoleSwitch}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200",
            activeTab === 'admin' 
              ? "bg-surface-container-low text-primary font-bold border-r-4 border-primary"
              : "text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-on-surface"
          )}
        >
          <ShieldCheck size={20} />
          <span className="font-headline tracking-tight">Admin Dashboard</span>
        </button>

        <div className="mt-6 flex items-center gap-3 p-2 rounded-2xl bg-surface-container-low">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-primary/10"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
              {user.messType}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
