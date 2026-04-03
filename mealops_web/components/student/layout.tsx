"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import {
   Home,
   UtensilsCrossed,
   QrCode,
   History,
   ShoppingCart,
   BarChart3,
   User,
   ShieldCheck,
   Bell,
   Menu,
   X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
   { icon: Home, label: 'Home', href: '/app/dashboard' },
   { icon: UtensilsCrossed, label: 'Menu', href: '/app/menu' },
   { icon: QrCode, label: 'Scan', href: '/app/scan' },
   { icon: History, label: 'Meal Log', href: '/app/log' },
   { icon: ShoppingCart, label: 'Pre-Order', href: '/app/preorder' },
   { icon: BarChart3, label: 'Nutrition', href: '/app/nutrition' },
  { icon: User, label: 'Profile', href: '/app/profile' },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="min-h-screen bg-surface flex selection:bg-primary selection:text-white">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-80 flex-col py-12 px-10 z-50">
        <div className="mb-16 px-2">
          <h1 className="text-4xl font-black text-primary tracking-tighter leading-none">Meal<br/>Ops.</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant font-black mt-3 opacity-30 italic">The Digital Agrarian</p>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 w-full px-6 py-4 rounded-[1.5rem] transition-all duration-500 group",
                pathname === item.href 
                  ? "bg-primary text-white shadow-[0px_20px_40px_rgba(16,71,21,0.2)] scale-[1.02]" 
                  : "text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-lowest"
              )}
            >
              <item.icon size={22} className={cn("transition-transform duration-500 group-hover:scale-110", pathname === item.href ? "text-white" : "text-primary/60")} />
              <span className="text-lg font-black tracking-tighter">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-10">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-4 w-full px-6 py-4 rounded-[1.5rem] text-on-surface-variant/60 font-black hover:text-on-surface transition-all duration-500 group"
          >
            <ShieldCheck size={22} className="group-hover:text-secondary transition-colors" />
            <span className="text-sm uppercase tracking-widest">Admin Portal</span>
          </Link>

          <button
            onClick={() => {
              clearAuth();
              window.location.href = '/login';
            }}
            className="mt-6 w-full flex items-center gap-4 p-5 rounded-[2.5rem] bg-surface-container-low text-on-surface-variant hover:text-on-surface shadow-sm transition-all hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-[1.2rem] bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-sm font-black text-on-surface truncate tracking-tight">{user?.name || 'Student'}</p>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">
                {user?.messType || 'VEG'} Protocol Engaged
              </p>
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
          
          <div className="flex flex-col">
            <h2 className="text-4xl font-headline font-black text-on-surface tracking-tighter leading-none mb-1">
              {navItems.find(i => i.href === pathname)?.label || 'Overview'}.
            </h2>
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] hidden lg:block opacity-30 mt-1">
              Hostel Mess Ecosystem • Institutional Intake Flux
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-4 bg-surface-container-low rounded-[1.2rem] hover:bg-surface-container-high transition-all hover:scale-105 group shadow-sm">
              <Bell size={22} className="text-on-surface-variant group-hover:text-on-surface" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface-container-low animate-bounce" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="px-12 lg:px-20 py-12 flex-1 lg:ml-80 pb-32 lg:pb-12">
          {children}
        </div>

        {/* Bottom Nav (Mobile Only) */}
            <nav className="lg:hidden h-20 bg-surface-container-lowest border-t border-outline-variant/20 flex items-center justify-around px-4 sticky bottom-0 z-40">
           {navItems.slice(0, 5).map((item) => (
             <Link 
               key={item.href}
               href={item.href}
               className={cn(
                  "p-3 rounded-2xl transition-all",
                           pathname === item.href ? "bg-primary text-white shadow-lg" : "text-on-surface-variant"
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
               className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-surface-container-lowest z-[60] p-6 lg:hidden"
            >
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
                     <h1 className="text-xl font-bold">MealOps</h1>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 bg-surface-container rounded-xl">
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
