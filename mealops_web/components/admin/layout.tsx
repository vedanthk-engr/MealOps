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
      <div className="min-h-screen bg-surface flex">
      {/* Sidebar Desktop */}
         <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 border-r border-outline-variant/15 glass-nav flex-col py-8 px-6 z-50">
            <div className="mb-10 px-2">
               <h1 className="text-2xl font-black text-primary tracking-tighter">MealOps</h1>
               <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Admin Console</p>
        </div>

            <nav className="flex-1 space-y-2">
          {adminNavItems.map((item) => (
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
               <button
                  onClick={() => {
                     clearAuth();
                     window.location.href = '/admin/login';
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low text-on-surface-variant hover:text-on-surface"
               >
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant font-bold">
                     {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                     <p className="text-sm font-bold text-on-surface truncate">{user?.name || 'Admin'}</p>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">System Admin</p>
                  </div>
                  <LogOut size={16} />
               </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 right-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/5 px-6 lg:px-10 py-6 flex items-center justify-between lg:ml-64">
           <div className="flex items-center space-x-4 lg:hidden">
              <button onClick={() => setIsOpen(true)} className="p-2 bg-surface-container-low rounded-xl">
                 <Menu size={20} />
              </button>
           </div>
           
           <div className="flex items-center space-x-3">
              <h2 className="font-headline font-extrabold text-2xl text-primary tracking-tight">
                 {adminNavItems.find(i => i.href === pathname)?.label || 'Console'}
              </h2>
              {pathname === '/admin/dashboard' && (
                 <span className="flex items-center space-x-1.5 px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-black rounded-full uppercase tracking-widest leading-none">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span>Systems Operational</span>
                 </span>
              )}
           </div>

           <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col text-right pr-4 border-r border-gray-100">
                  <span className="text-xs font-bold text-on-surface">Mess Operating Standard</span>
                  <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-[2px]">VIT Chennai Core</span>
              </div>
              <button className="p-2.5 bg-surface-container-low rounded-xl relative hover:bg-surface-container-high transition-colors">
                  <Bell size={20} className="text-on-surface-variant" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors">
                  <Settings size={20} className="text-on-surface-variant" />
              </button>
           </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-10 flex-1 lg:ml-64">
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
