"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { Loader2, ShieldCheck, Fingerprint, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function LoginPage() {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'IDLE' | 'VERIFYING' | 'CAPTCHA' | 'PROFILE'>('IDLE');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo || !password) return;

    setIsLoading(true);
    try {
      // Step 1: Verification
      setStep('VERIFYING');
      await new Promise(r => setTimeout(r, 800));
      
      // Step 2: Captcha solving
      setStep('CAPTCHA');
      await new Promise(r => setTimeout(r, 1000));
      
      // Step 3: Fetching profile
      setStep('PROFILE');
      
      const response = await api.post('/api/auth/vtop-login', { regNo, password });
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-center bg-[#2A5F2A] text-white">
          <div className="w-20 h-20 bg-white/10 rounded-2xl mx-auto flex items-center justify-center mb-4">
             <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">MealOps</h1>
          <p className="text-white/70 text-sm mt-1">Smart Mess Ecosystem • VIT Chennai</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!isLoading ? (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    required
                    placeholder="21BCEXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2A5F2A] focus:border-transparent outline-none transition-all"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2A5F2A] focus:border-transparent outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2A5F2A] text-white py-4 rounded-xl font-bold hover:bg-[#1e4a1e] transition-colors shadow-lg shadow-[#2A5F2A]/20"
                >
                  Login with VTOP
                </button>
                <div className="text-center">
                   <a href="/admin/login" className="text-sm text-[#2A5F2A] hover:underline">Admin Login</a>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative">
                  <Loader2 size={60} className="text-[#2A5F2A] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {step === 'VERIFYING' && <ShieldCheck size={24} className="text-[#2A5F2A]" />}
                    {step === 'CAPTCHA' && <Fingerprint size={24} className="text-[#2A5F2A]" />}
                    {step === 'PROFILE' && <UserCircle size={24} className="text-[#2A5F2A]" />}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {step === 'VERIFYING' && "Connecting to VTOP..."}
                    {step === 'CAPTCHA' && "Solving Captcha..."}
                    {step === 'PROFILE' && "Syncing Profile..."}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">This usually takes a few seconds.</p>
                </div>
                
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                   <motion.div 
                     className="bg-[#2A5F2A] h-full"
                     initial={{ width: "0%" }}
                     animate={{ 
                       width: step === 'VERIFYING' ? '33%' : (step === 'CAPTCHA' ? '66%' : '100%') 
                     }}
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
