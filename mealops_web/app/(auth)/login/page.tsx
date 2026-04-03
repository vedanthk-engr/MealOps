"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { Loader2, ShieldCheck, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function LoginPage() {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'IDLE' | 'LOGGING_IN'>('IDLE');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleFinalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo || !password) return;

    setStep('LOGGING_IN');
    try {
      const response = await api.post('/api/auth/vtop-login', { 
        regNo, 
        password
      });
      const { token, student } = response.data;

      setAuth({
        regNo: student.regNo,
        name: student.name,
        email: student.email,
        role: 'STUDENT',
        messType: student.messType,
        hostelBlock: student.hostelBlock
      }, token);

      toast.success(`Welcome back, ${student.name}!`);
      router.push('/app/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "VTOP Authentication failed. Please check your credentials.");
      setStep('IDLE');
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-center bg-primary-fixed text-on-primary-fixed-variant border-b border-primary/10">
          <div className="w-20 h-20 bg-white rounded-2xl border border-primary/20 mx-auto flex items-center justify-center mb-4">
             <ShieldCheck size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold">MealOps</h1>
          <p className="text-on-surface-variant text-sm mt-1">Smart Mess Ecosystem • VIT Chennai</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'IDLE' && (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleFinalLogin} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    required
                    placeholder="21BCEXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:ring-2 focus:ring-primary/20 focus:border-transparent outline-none transition-all"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VTOP Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:ring-2 focus:ring-primary/20 focus:border-transparent outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-colors shadow-lg shadow-primary/20"
                >
                  Secure Login with VTOP
                </button>
                <div className="text-center">
                   <a href="/admin/login" className="text-sm text-primary hover:underline">Admin Login</a>
                </div>
              </motion.form>
            )}

            {step === 'LOGGING_IN' && (
              <motion.div 
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative">
                  <Loader2 size={60} className="text-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UserCircle size={24} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Authenticating with VTOP...
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">Connecting to VIT Chennai's portal...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
