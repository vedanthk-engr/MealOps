import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  regNo: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  messType?: string;
  hostelBlock?: string;
  roomNo?: string;
  branch?: string;
  programme?: string;
  school?: string;
  messCaterer?: string;
  proctorEmail?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        Cookies.set('mealops_jwt', token, { expires: 7 });
        set({ user, isAuthenticated: true });
      },
      clearAuth: () => {
        Cookies.remove('mealops_jwt');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'mealops_auth_v1',
    }
  )
);
