"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { LayoutDashboard, Utensils, BarChart3, Package, Users, Bell, LogOut, ShieldAlert, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Utensils, label: 'Standard Menu', href: '/admin/menu' },
  { icon: BarChart3, label: 'Deep Analytics', href: '/admin/analytics' },
  { icon: Package, label: 'Pre-Orders', href: '/admin/preorders' },
  { icon: Users, label: 'Student Directory', href: '/admin/students' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-white flex-col border-r border-gray-200 sticky top-0 h-screen z-50">
        <div className="p-8">
           <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl ring-4 ring-red-50">
                 A
              </div>
              <div>
                 <h1 className="text-xl font-bold text-[#1A1A1A]">MealOps</h1>
                 <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest leading-none mt-1">Management Portal</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all font-medium",
                pathname === item.href 
                  ? "bg-red-600 text-white shadow-lg shadow-red-200" 
                  : "text-gray-400 hover:bg-red-50 hover:text-red-600"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 bg-red-50/30">
           <div className="flex items-center space-x-4 px-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold border-2 border-white shadow-sm flex-shrink-0">
                 {user?.name?.[0].toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0 pr-4">
                 <h2 className="text-sm font-bold text-gray-800 truncate leading-none">{user?.name}</h2>
                 <p className="text-[10px] text-gray-400 font-mono mt-1">System Admin</p>
              </div>
              <button 
                onClick={() => { clearAuth(); window.location.href = '/admin/login'; }}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                  <LogOut size={16} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-10 flex items-center justify-between">
           <div className="flex items-center space-x-4 lg:hidden">
              <button onClick={() => setIsOpen(true)} className="p-2 bg-gray-100 rounded-xl">
                 <Menu size={20} />
              </button>
           </div>
           
           <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-800">
                 {adminNavItems.find(i => i.href === pathname)?.label || 'Console'}
              </h2>
              {pathname === '/admin/dashboard' && (
                 <span className="flex items-center space-x-1.5 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full border border-green-100 uppercase tracking-widest leading-none">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span>Systems Operational</span>
                 </span>
              )}
           </div>

           <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col text-right pr-4 border-r border-gray-100">
                  <span className="text-xs font-bold text-gray-800">Mess Operating Standard</span>
                  <span className="text-[10px] text-[#888888] font-medium uppercase tracking-[2px]">VIT Chennai Core</span>
              </div>
              <button className="p-2.5 bg-gray-100 rounded-xl relative hover:bg-gray-200 transition-colors">
                  <ShieldAlert size={20} className="text-red-500" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  <Settings size={20} className="text-gray-600" />
              </button>
           </div>
        </header>

        {/* Content */}
        <div className="p-10 flex-1">
           {children}
        </div>
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
               className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm lg:hidden" 
            />
            <motion.aside 
               initial={{ x: '-100%' }}
               animate={{ x: 0 }}
               exit={{ x: '-100%' }}
               className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white z-[110] p-6 lg:hidden"
            >
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
                     <h1 className="text-xl font-bold">MealOps Admin</h1>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-xl">
                     <X size={20} />
                  </button>
               </div>
               <nav className="space-y-4">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all font-medium text-lg",
                        pathname === item.href ? "bg-red-600 text-white" : "text-gray-500"
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
