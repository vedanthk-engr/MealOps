"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { LayoutDashboard, Utensils, Camera, ClipboardList, Package, LineChart, User, LogOut, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // I'll define this in lib/utils later

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/app/dashboard' },
  { icon: Utensils, label: 'Mess Menu', href: '/app/menu' },
  { icon: Camera, label: 'Food Scan', href: '/app/scan' },
  { icon: ClipboardList, label: 'Meal Log', href: '/app/log' },
  { icon: Package, label: 'Pre-Order', href: '/app/preorder' },
  { icon: LineChart, label: 'Nutrition', href: '/app/nutrition' },
  { icon: User, label: 'Profile', href: '/app/profile' },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-white flex-col border-r border-gray-200 sticky top-0 h-screen">
        <div className="p-8">
           <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#2A5F2A] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                 M
              </div>
              <div>
                 <h1 className="text-xl font-bold text-[#1A1A1A]">MealOps</h1>
                 <p className="text-[#888888] text-[10px] uppercase font-bold tracking-widest">Student Portal</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all font-medium",
                pathname === item.href 
                  ? "bg-[#2A5F2A] text-white shadow-lg shadow-[#2A5F2A]/20" 
                  : "text-[#888888] hover:bg-gray-50 hover:text-[#2A5F2A]"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
           <div className="bg-[#F5F3EE] p-4 rounded-2xl flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2A5F2A] font-bold shadow-sm">
                 {user?.name?.[0].toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                 <h2 className="text-sm font-bold text-gray-800 truncate">{user?.name}</h2>
                 <p className="text-[10px] text-gray-500 font-mono">{user?.regNo}</p>
              </div>
              <button 
                onClick={() => { clearAuth(); window.location.href = '/login'; }}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                  <LogOut size={16} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
           <div className="flex items-center space-x-4 lg:hidden">
              <button onClick={() => setIsOpen(true)} className="p-2 bg-gray-100 rounded-xl">
                 <Menu size={20} />
              </button>
           </div>
           
           <h2 className="text-xl font-bold text-gray-800">
              {navItems.find(i => i.href === pathname)?.label || 'Overview'}
           </h2>

           <div className="flex items-center space-x-4">
              <button className="p-2.5 bg-gray-100 rounded-xl relative hover:bg-gray-200 transition-colors">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#F5A623] rounded-full border-2 border-white"></span>
              </button>
           </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-10 flex-1">
           {children}
        </div>

        {/* Bottom Nav (Mobile Only) */}
        <nav className="lg:hidden h-20 bg-white border-t border-gray-200 flex items-center justify-around px-4 sticky bottom-0 z-40">
           {navItems.slice(0, 5).map((item) => (
             <Link 
               key={item.href}
               href={item.href}
               className={cn(
                  "p-3 rounded-2xl transition-all",
                  pathname === item.href ? "bg-[#2A5F2A] text-white shadow-lg" : "text-gray-400"
               )}
             >
                <item.icon size={22} />
             </Link>
           ))}
        </nav>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden" 
            />
            <motion.aside 
               initial={{ x: '-100%' }}
               animate={{ x: 0 }}
               exit={{ x: '-100%' }}
               className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white z-[60] p-6 lg:hidden"
            >
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-[#2A5F2A] rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
                     <h1 className="text-xl font-bold">MealOps</h1>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-xl">
                     <X size={20} />
                  </button>
               </div>
               <nav className="space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all font-medium text-lg",
                        pathname === item.href ? "bg-[#2A5F2A] text-white" : "text-gray-500"
                      )}
                    >
                      <item.icon size={24} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
               </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
