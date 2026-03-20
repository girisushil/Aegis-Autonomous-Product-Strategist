import { CheckCircle2, AlertTriangle, Info, Zap } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Sections
import CommandCenter from './sections/CommandCenter';
import SentinelOverview from './sections/SentinelOverview';
import AgentOrchestration from './sections/AgentOrchestration';
import LiveSignals from './sections/LiveSignals';
import WarRoom from './sections/WarRoom';

import React from 'react';

// Combat Mode Context
export interface CombatModeContextType {
  isCombatMode: boolean;
  setIsCombatMode: (value: boolean) => void;
}

export const CombatModeContext = React.createContext<CombatModeContextType>({
  isCombatMode: false,
  setIsCombatMode: () => {},
});

// Notification Context
export interface Notification {
  message: string;
  type: 'success' | 'warning' | 'info';
  id: number;
}

export interface NotificationContextType {
  notification: Notification | null;
  triggerNotification: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

export const NotificationContext = React.createContext<NotificationContextType>({
  notification: null,
  triggerNotification: () => {},
});

// Main App Component — Pure SPA (no scroll-driven animations)
function App() {
  const [isCombatMode, setIsCombatMode] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    if (isCombatMode) {
      document.body.classList.add('combat-mode');
      const timer = setTimeout(() => {
        setIsCombatMode(false);
        document.body.classList.remove('combat-mode');
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      document.body.classList.remove('combat-mode');
    }
  }, [isCombatMode]);

  return (
    <CombatModeContext.Provider value={{ isCombatMode, setIsCombatMode }}>
      <NotificationContext.Provider value={{ notification, triggerNotification }}>
        <div className={`app-container ${isCombatMode ? 'crisis-mode' : ''}`}>
          {/* Noise Overlay */}
          <div className="noise-overlay" />
          
          {/* Fixed Dashboard Chrome */}
          <Header isCombatMode={isCombatMode} />
          <Sidebar />
          
          {/* Main Content Area — SPA Routes */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/overview" element={<CommandCenter />} />
              <Route path="/sentinel" element={<SentinelOverview />} />
              <Route path="/agents" element={<AgentOrchestration />} />
              <Route path="/signals" element={<LiveSignals />} />
              <Route path="/warroom" element={<WarRoom />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <NotificationToast />
        </div>
      </NotificationContext.Provider>
    </CombatModeContext.Provider>
  );
}

function NotificationToast() {
  const { notification } = useContext(NotificationContext);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-[#00F0C8]" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-[#FFB000]" />;
      case 'info': return <Info className="w-5 h-5 text-[#2E5BFF]" />;
      default: return <Zap className="w-5 h-5 text-cyan" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast ${notification.type}`}>
        {getIcon()}
        <span className="toast-message">{notification.message}</span>
      </div>
    </div>
  );
}

export default App;
