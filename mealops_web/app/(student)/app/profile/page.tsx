"use client";

import React from 'react';
import StudentLayout from '@/components/student/layout';
import { useAuthStore } from '@/store/auth';
import { motion } from 'framer-motion';
import { User, Mail, School, Building2, Utensils, ShieldCheck, LogOut, Settings, Bell, Palette, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    toast.info("Logged out successfully");
    window.location.href = '/login';
  };

  const studentInfo = [
    { label: 'Registration Number', value: user?.regNo, icon: User },
    { label: 'Email Address', value: user?.email, icon: Mail },
    { label: 'Academic Programme', value: user?.programme, icon: School },
    { label: 'Academic Branch', value: user?.branch, icon: School },
    { label: 'Hostel Block', value: user?.hostelBlock, icon: Building2 },
    { label: 'Room Number', value: user?.roomNo, icon: ShieldCheck },
    { label: 'Mess System', value: user?.messType, icon: Utensils },
    { label: 'Mess Caterer', value: user?.messCaterer, icon: Utensils },
  ];

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        
        {/* Profile Hero Card */}
        <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
           <div className="w-full md:w-80 bg-[#2A5F2A] p-12 flex flex-col items-center justify-center text-white relative">
              <div className="w-32 h-32 bg-white/10 rounded-[45px] flex items-center justify-center mb-6 relative border-4 border-white/20">
                 <span className="text-5xl font-black">{user?.name?.[0].toUpperCase()}</span>
                 <div className="absolute -bottom-2 -right-2 p-3 bg-[#F5A623] rounded-2xl border-4 border-[#2A5F2A]">
                    <ShieldCheck size={20} />
                 </div>
              </div>
              <h2 className="text-2xl font-black text-center leading-none mb-2">{user?.name}</h2>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Student</span>
              
              <div className="absolute top-0 left-0 p-8 opacity-10 rotate-45 transform -translate-x-1/2 -translate-y-1/2">
                 <Utensils size={120} />
              </div>
           </div>
           
           <div className="flex-1 p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {studentInfo.map((info, i) => (
                <div key={i} className="space-y-1">
                   <div className="flex items-center space-x-2 text-gray-400">
                      <info.icon size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">{info.label}</span>
                   </div>
                   <p className="font-bold text-gray-800">{info.value}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
           {/* Notification Settings */}
           <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4 mb-8">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Bell /></div>
                 <h3 className="text-lg font-black text-gray-800">Alert Preferences</h3>
              </div>
              <div className="space-y-6">
                 {[
                   { label: 'Meal Pre-order Deadline', desc: 'Notify me (9:00 PM)', val: true },
                   { label: 'Daily Menu Updates', desc: 'Morning 7:00 AM summary', val: true },
                   { label: 'Personalized Nutrition Alerts', desc: 'When targets are exceeded', val: false }
                 ].map((s, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-bold text-gray-800">{s.label}</p>
                         <p className="text-[10px] text-gray-400 font-medium">{s.desc}</p>
                      </div>
                      <div className={cn("w-12 h-6 rounded-full relative p-1 transition-all", s.val ? "bg-[#2A5F2A]" : "bg-gray-200")}>
                         <div className={cn("w-4 h-4 bg-white rounded-full shadow-sm transition-all trasform", s.val ? "translate-x-6" : "translate-x-0")} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* App Preferences */}
           <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4 mb-8">
                 <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Palette /></div>
                 <h3 className="text-lg font-black text-gray-800">Interface Settings</h3>
              </div>
              <div className="space-y-4">
                 <button className="w-full flex items-center justify-between p-4 bg-[#F5F3EE] rounded-2xl hover:bg-gray-100 transition-all group">
                    <span className="text-xs font-bold text-gray-700">App Theme</span>
                    <span className="text-xs font-black text-[#888888] flex items-center">System Light <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" /></span>
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-[#F5F3EE] rounded-2xl hover:bg-gray-100 transition-all group">
                    <span className="text-xs font-bold text-gray-700">Language</span>
                    <span className="text-xs font-black text-[#888888] flex items-center">English <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" /></span>
                 </button>
                 
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center justify-center space-x-4 p-5 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all font-black text-sm mt-4 shadow-sm"
                 >
                    <LogOut size={20} />
                    <span>SECURE LOGOUT</span>
                 </button>
              </div>
           </div>

        </div>

      </div>
    </StudentLayout>
  );
}
