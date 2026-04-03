import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Scale, 
  Ruler, 
  Target, 
  Sun, 
  Moon, 
  LogOut, 
  Edit3,
  CheckCircle2,
  Search,
  Bell,
  Map as MapIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [theme, setTheme] = useState<'Harvest' | 'Midnight'>('Harvest');

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Profile Card */}
      <div className="bg-white rounded-[2.5rem] shadow-[0px_24px_48px_rgba(27,28,25,0.04)] overflow-hidden border border-outline-variant/5">
        {/* Top Section: User Info */}
        <div className="p-10 flex items-start gap-10 border-b border-outline-variant/10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-low shadow-lg">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border-4 border-white">
              <CheckCircle2 size={16} fill="currentColor" className="text-white" />
            </div>
          </div>

          <div className="flex-1 pt-2">
            <div className="flex items-center gap-4 mb-1">
              <h2 className="text-4xl font-black text-on-surface tracking-tight">{user.name} S.</h2>
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-black uppercase tracking-widest">
                Premium Member
              </span>
            </div>
            <p className="text-on-surface-variant font-bold mb-8">@{user.name.toLowerCase()}_s</p>

            <div className="grid grid-cols-4 gap-8">
              <InfoItem label="Gender" value="Male" />
              <InfoItem label="Date of Birth" value="Jan 14, 2002" />
              <InfoItem label="Age" value="24 Years" />
              <InfoItem label="Mess" value={user.messType === 'VEG' ? 'Veg Mess' : 'Non-Veg Mess'} />
            </div>
          </div>
        </div>

        {/* Middle Section: Stats */}
        <div className="p-10 bg-surface-container-low/30 grid grid-cols-3 gap-6">
          <StatCard label="Current Weight" value="78" unit="kg" icon={Scale} color="bg-primary/10 text-primary" />
          <StatCard label="Height" value="182" unit="cm" icon={Ruler} color="bg-secondary/10 text-secondary" />
          <StatCard label="Goal Weight" value="75" unit="kg" icon={Target} color="bg-tertiary/10 text-tertiary" />
        </div>

        {/* Bottom Section: Settings & Actions */}
        <div className="p-10 space-y-10">
          <div>
            <h3 className="text-xl font-black text-on-surface mb-6">Experience Settings</h3>
            <div className="bg-surface-container-low p-6 rounded-3xl flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Interface Theme</p>
                <p className="text-sm text-on-surface-variant font-medium">Switch between a light editorial look or deep dark mode.</p>
              </div>
              <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-outline-variant/10">
                <button 
                  onClick={() => setTheme('Harvest')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
                    theme === 'Harvest' ? "bg-surface-container-low text-primary shadow-sm" : "text-on-surface-variant"
                  )}
                >
                  <Sun size={16} />
                  Harvest
                </button>
                <button 
                  onClick={() => setTheme('Midnight')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
                    theme === 'Midnight' ? "bg-surface-container-low text-primary shadow-sm" : "text-on-surface-variant"
                  )}
                >
                  <Moon size={16} />
                  Midnight
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-6">
            <button className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-error transition-colors">
              Sign Out
            </button>
            <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
              <Edit3 size={20} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Footer Cards */}
      <div className="grid grid-cols-12 gap-8 mt-10">
        <div className="col-span-8 bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4 tracking-tight">Metabolic Momentum</h3>
            <p className="text-white/70 font-medium max-w-md leading-relaxed">
              You've hit your fiber targets 12 days in a row. That's a new personal record for your digestive harvest.
            </p>
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-primary border-2 border-primary">🔥</div>
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary border-2 border-primary">🥗</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 right-10 text-8xl font-black text-white/5 tracking-tighter">
            Lvl. 24
          </div>
        </div>

        <div className="col-span-4 bg-surface-container-low rounded-[2.5rem] p-10 relative overflow-hidden shadow-sm border border-outline-variant/5">
          <h3 className="text-xl font-black text-on-surface mb-2">Kitchen Proximity</h3>
          <p className="text-sm text-on-surface-variant font-medium mb-8">Local harvest markers near you in {user.messType === 'VEG' ? 'Veg Mess' : 'Non-Veg Mess'}.</p>
          
          <div className="flex items-center gap-3 text-primary">
            <MapIcon size={20} className="fill-primary/10" />
            <span className="font-black">4 Markets Open</span>
          </div>

          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 p-4 opacity-10">
            <LeafIcon size={120} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{label}</p>
    <p className="font-bold text-on-surface">{value}</p>
  </div>
);

const StatCard = ({ label, value, unit, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between border border-outline-variant/5">
    <div>
      <p className="text-xs font-bold text-on-surface-variant mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-on-surface">{value}</span>
        <span className="text-xs font-bold text-on-surface-variant">{unit}</span>
      </div>
    </div>
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", color)}>
      <Icon size={24} />
    </div>
  </div>
);

const LeafIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.17,20C14.33,20 19,15.33 19,9.17C19,8.75 18.97,8.33 18.92,7.91C18.92,7.95 18.92,8 18.92,8C18.92,8 20.08,8 21,8C21,8 21,7 21,6C21,4 19,2 17,2C16,2 15,2 15,2C15,2 15,3.17 15,4.08C15,4.08 15.05,4.08 15.08,4.08C14.67,4.03 14.25,4 13.83,4C7.67,4 3,8.67 3,14.83C3,15.36 3.13,15.86 3.3,16.34L1,17.29L1.66,19.18C6.83,17.1 13,15 15,6C15,6 16,6 17,6C17,6 17,7 17,8Z" />
  </svg>
);
