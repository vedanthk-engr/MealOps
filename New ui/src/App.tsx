import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Menu } from './pages/Menu';
import { Scan } from './pages/Scan';
import { MealLog } from './pages/MealLog';
import { PreOrder } from './pages/PreOrder';
import { Nutrition } from './pages/Nutrition';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { MOCK_USER, MOCK_ADMIN } from './constants';
import { User } from './types';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User>(MOCK_USER);

  const handleRoleSwitch = () => {
    if (user.role === 'student') {
      setUser(MOCK_ADMIN);
      setActiveTab('admin-dashboard');
    } else {
      setUser(MOCK_USER);
      setActiveTab('home');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard user={user} />;
      case 'menu':
        return <Menu />;
      case 'scan':
        return <Scan />;
      case 'meal-log':
        return <MealLog />;
      case 'pre-order':
        return <PreOrder />;
      case 'nutrition':
        return <Nutrition />;
      case 'profile':
        return <Profile user={user} />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-analytics':
        return <AdminAnalytics />;
      default:
        return <Dashboard user={user} />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return `Welcome back, ${user.name}`;
      case 'menu': return 'Weekly Harvest Menu';
      case 'scan': return 'AI Meal Identification';
      case 'meal-log': return 'Your Meal Log';
      case 'pre-order': return 'Pre-Order Tomorrow';
      case 'nutrition': return 'Nutrition Analytics';
      case 'profile': return 'Personal Harvest Profile';
      case 'admin-dashboard': return 'Admin Overview';
      case 'admin-analytics': return 'Kitchen Intelligence';
      default: return 'MealOps';
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'home': return 'Your personalized nutrition dashboard for today.';
      case 'menu': return 'Fresh, seasonal, and nutritionally balanced meals.';
      case 'scan': return 'Scan your plate to instantly track macros and ingredients.';
      case 'meal-log': return 'Keep track of your daily intake and provide feedback.';
      case 'pre-order': return 'Help us reduce wastage by planning your meals ahead.';
      case 'nutrition': return 'Long-term trends and metabolic insights.';
      case 'profile': return 'Manage your biometric data and metabolic preferences.';
      case 'admin-dashboard': return 'Real-time metrics and operational oversight.';
      case 'admin-analytics': return 'Data-driven insights for a sustainable kitchen.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onRoleSwitch={handleRoleSwitch}
      />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopBar 
          title={getPageTitle()} 
          subtitle={getPageSubtitle()} 
          user={user} 
        />
        
        <div className="p-10 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
