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
      <div className="min-h-screen bg-surface flex">
      {/* Sidebar Desktop */}
         <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 border-r border-outline-variant/15 glass-nav flex-col py-8 px-6 z-50">
            <div className="mb-10 px-2">
               <h1 className="text-2xl font-black text-primary tracking-tighter">MealOps</h1>
               <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">VIT Smart Mess</p>
        </div>

            <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200",
                pathname === item.href 
                           ? "bg-surface-container-low text-primary font-bold border-r-4 border-primary"
                           : "text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              <item.icon size={20} />
                     <span className="font-headline tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>

            <div className="mt-auto pt-6 border-t border-outline-variant/10">
               <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-on-surface transition-all duration-200"
               >
                  <ShieldCheck size={20} />
                  <span className="font-headline tracking-tight">Admin Dashboard</span>
               </Link>

               <button
                  onClick={() => {
                     clearAuth();
                     window.location.href = '/login';
                  }}
                  className="mt-4 w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low text-on-surface-variant hover:text-on-surface"
               >
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant font-bold">
                     {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                     <p className="text-sm font-bold text-on-surface truncate">{user?.name || 'Student'}</p>
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                        {user?.messType || 'VEG'}
                     </span>
                  </div>
               </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
            <header className="sticky top-0 right-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 lg:px-10 py-6 border-b border-outline-variant/5 lg:ml-64">
           <div className="flex items-center space-x-4 lg:hidden">
                     <button onClick={() => setIsOpen(true)} className="p-2 bg-surface-container-low rounded-xl">
                 <Menu size={20} />
              </button>
           </div>
           
                <h2 className="font-headline font-extrabold text-2xl text-primary tracking-tight">
              {navItems.find(i => i.href === pathname)?.label || 'Overview'}
           </h2>

           <div className="flex items-center space-x-4">
                     <button className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors">
                           <Bell size={20} className="text-on-surface-variant" />
                           <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
              </button>
           </div>
        </header>

        {/* Content */}
            <div className="p-6 lg:p-10 flex-1 lg:ml-64">
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
