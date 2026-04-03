"use client";

import React, { useState } from 'react';
import StudentLayout from '@/components/student/layout';
import { Scale, Ruler, Target, Sun, Moon, Edit3, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [theme, setTheme] = useState<'Harvest' | 'Midnight'>('Harvest');

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="bg-white rounded-[2.5rem] shadow-[0px_24px_48px_rgba(27,28,25,0.04)] overflow-hidden border border-outline-variant/5">
          <div className="p-10 flex items-start gap-10 border-b border-outline-variant/10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-low shadow-lg bg-surface-container flex items-center justify-center text-4xl font-black text-primary">
                {user?.name?.[0] || 'S'}
              </div>
              <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border-4 border-white">
                <CheckCircle2 size={16} fill="currentColor" className="text-white" />
              </div>
            </div>

            <div className="flex-1 pt-2">
              <div className="flex items-center gap-4 mb-1 flex-wrap">
                <h2 className="text-4xl font-black text-on-surface tracking-tight">{user?.name || 'Student'} </h2>
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-black uppercase tracking-widest">Premium Member</span>
              </div>
              <p className="text-on-surface-variant font-bold mb-8">@{(user?.name || 'student').toLowerCase().replace(/\s+/g, '_')}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <InfoItem label="Gender" value="Male" />
                <InfoItem label="Date of Birth" value="Jan 14, 2002" />
                <InfoItem label="Age" value="24 Years" />
                <InfoItem label="Mess" value={user?.messType === 'VEG' ? 'Veg Mess' : 'Non-Veg Mess'} />
              </div>
            </div>
          </div>

          <div className="p-10 bg-surface-container-low/30 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Current Weight" value="78" unit="kg" icon={Scale} color="bg-primary/10 text-primary" />
            <StatCard label="Height" value="182" unit="cm" icon={Ruler} color="bg-secondary/10 text-secondary" />
            <StatCard label="Goal Weight" value="75" unit="kg" icon={Target} color="bg-tertiary/10 text-tertiary" />
          </div>

          <div className="p-10 space-y-10">
            <div>
              <h3 className="text-xl font-black text-on-surface mb-6">Experience Settings</h3>
              <div className="bg-surface-container-low p-6 rounded-3xl flex items-center justify-between flex-wrap gap-6">
                <div>
                  <p className="font-bold text-on-surface">Interface Theme</p>
                  <p className="text-sm text-on-surface-variant font-medium">Switch between a light editorial look or deep dark mode.</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-outline-variant/10">
                  <button onClick={() => setTheme('Harvest')} className={cn('flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all', theme === 'Harvest' ? 'bg-surface-container-low text-primary shadow-sm' : 'text-on-surface-variant')}>
                    <Sun size={16} /> Harvest
                  </button>
                  <button onClick={() => setTheme('Midnight')} className={cn('flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all', theme === 'Midnight' ? 'bg-surface-container-low text-primary shadow-sm' : 'text-on-surface-variant')}>
                    <Moon size={16} /> Midnight
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-6">
              <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                <Edit3 size={20} /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold text-on-surface">{value}</p>
    </div>
  );
}

function StatCard({ label, value, unit, icon: Icon, color }: { label: string; value: string; unit: string; icon: React.ComponentType<{ size?: number }>; color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between border border-outline-variant/5">
      <div>
        <p className="text-xs font-bold text-on-surface-variant mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-on-surface">{value}</span>
          <span className="text-xs font-bold text-on-surface-variant">{unit}</span>
        </div>
      </div>
      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', color)}>
        <Icon size={24} />
      </div>
    </div>
  );
}
