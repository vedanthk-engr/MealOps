"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { LayoutDashboard, BarChart3, Bell, LogOut, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const adminNavItems = [
   { icon: LayoutDashboard, label: 'Admin Dashboard', href: '/admin/dashboard' },
   { icon: BarChart3, label: 'Kitchen Intelligence', href: '/admin/analytics' },
   { icon: Bell, label: 'Pre-Orders', href: '/admin/preorders' },
   { icon: Settings, label: 'Menu Studio', href: '/admin/menu' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

   return (
    <div className="min-h-screen bg-surface flex selection:bg-primary selection:text-white">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-80 flex-col py-12 px-10 z-50">
        <div className="mb-16 px-2">
          <h1 className="text-4xl font-black text-primary tracking-tighter leading-none">MealOps.</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant font-black mt-3 opacity-30 italic">Central Command</p>
        </div>

        <nav className="flex-1 space-y-4">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 w-full px-6 py-4 rounded-[1.5rem] transition-all duration-500 group",
                pathname === item.href 
                  ? "bg-surface-container-low text-primary shadow-[0px_20px_40px_rgba(27,28,25,0.06)] scale-[1.02]" 
                  : "text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-lowest"
              )}
            >
              <item.icon size={22} className={cn("transition-transform duration-500 group-hover:scale-110", pathname === item.href && "text-primary")} />
              <span className="text-lg font-black tracking-tighter">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-10">
          <button
            onClick={() => {
              clearAuth();
              window.location.href = '/admin/login';
            }}
            className="w-full flex items-center gap-4 p-5 rounded-[2.5rem] bg-surface-container-low text-on-surface-variant hover:text-on-surface shadow-sm transition-all hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-[1.2rem] bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-sm font-black text-on-surface truncate tracking-tight">{user?.name || 'Administrator'}</p>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">System Override Active</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 right-0 z-40 bg-surface/40 backdrop-blur-3xl px-12 lg:px-20 py-8 flex items-center justify-between lg:ml-80">
          <div className="flex items-center space-x-6 lg:hidden">
            <button onClick={() => setIsOpen(true)} className="p-4 bg-surface-container-low rounded-2xl">
              <Menu size={24} />
            </button>
          </div>
          
          <div className="flex items-center space-x-6">
            <h2 className="text-4xl font-black text-on-surface tracking-tighter leading-none">
              {adminNavItems.find(i => i.href === pathname)?.label || 'Console'}
            </h2>
            {pathname === '/admin/dashboard' && (
              <span className="hidden md:flex items-center space-x-3 px-5 py-2.5 bg-primary/5 text-primary text-[10px] font-black rounded-full uppercase tracking-widest leading-none border border-primary/10">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(16,71,21,0.5)]" />
                <span>Harvest Systems Operational</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden xl:flex flex-col text-right pr-8 border-r border-surface-container-high">
              <span className="text-xs font-black text-on-surface tracking-tight">Institutional Standard</span>
              <span className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] opacity-30 mt-1">VIT Chennai Alpha</span>
            </div>
            <button className="p-4 bg-surface-container-low rounded-[1.2rem] relative hover:bg-surface-container-high transition-all hover:scale-105 group">
              <Bell size={22} className="text-on-surface-variant group-hover:text-on-surface" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface-container-low animate-bounce" />
            </button>
            <button className="p-4 bg-surface-container-low rounded-[1.2rem] hover:bg-surface-container-high transition-all hover:scale-105 group">
              <Settings size={22} className="text-on-surface-variant group-hover:text-on-surface" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="px-12 lg:px-20 py-12 flex-1 lg:ml-80">
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
               className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-surface-container-lowest z-[110] p-6 lg:hidden"
            >
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
                     <h1 className="text-xl font-bold">MealOps Admin</h1>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 bg-surface-container rounded-xl">
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
                                    pathname === item.href ? "bg-primary text-white" : "text-on-surface-variant"
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
