"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { UserCog, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/admin-login', { email, password });
      const { token, admin } = response.data;

      setAuth({
        regNo: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'ADMIN'
      }, token);

      toast.success("Welcome, Administrator.");
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast.error("Invalid admin credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center space-x-3 mb-8">
           <div className="p-3 bg-red-100 rounded-xl">
              <UserCog className="text-red-600" />
           </div>
           <div>
              <h1 className="text-2xl font-bold">Admin Console</h1>
              <p className="text-gray-400 text-sm">MealOps Management Portal</p>
           </div>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <div className="relative">
               <input
                type="email"
                required
                placeholder="admin@vitchennai.ac.in"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <UserCog className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Key</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Key className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
          >
            {isLoading ? "Authenticating Authority..." : "Secure Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
