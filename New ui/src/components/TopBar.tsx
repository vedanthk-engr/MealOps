import React from 'react';
import { Bell, User } from 'lucide-react';
import { User as UserType } from '../types';

interface TopBarProps {
  title: string;
  subtitle?: string;
  user: UserType;
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle, user }) => {
  return (
    <header className="sticky top-0 right-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center px-10 py-6 border-b border-outline-variant/5">
      <div className="flex flex-col">
        <h2 className="font-headline font-extrabold text-2xl text-primary tracking-tight">{title}</h2>
        {subtitle && <p className="text-on-surface-variant text-sm font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors group">
          <Bell size={20} className="text-on-surface-variant group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
        </button>

        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/10 cursor-pointer hover:bg-surface-container-low transition-all">
          <span className="text-sm font-bold text-primary">
            {user.role === 'admin' ? 'Admin Profile' : 'Student Profile'}
          </span>
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant font-bold text-xs uppercase">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
