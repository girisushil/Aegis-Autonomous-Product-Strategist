import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  Bot, 
  Radio, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard, path: '/' },
  { id: 'sentinel', label: 'Market Signals', icon: Globe, path: '/sentinel' },
  { id: 'agents', label: 'Agent Status', icon: Bot, path: '/agents' },
  { id: 'signals', label: 'Live Signals', icon: Radio, path: '/signals' },
  { id: 'warroom', label: 'War Room', icon: Zap, path: '/warroom' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/overview';
    }
    return location.pathname === path;
  };

  return (
    <aside 
      className={`fixed left-0 top-[56px] bottom-0 z-40 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-20 lg:w-64'
      }`}
      style={{
        background: 'linear-gradient(180deg, #12151C 0%, #0B0D10 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #2E5BFF 0%, #1A3DCC 100%)',
          border: '1px solid rgba(46, 91, 255, 0.4)',
        }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-white" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                active 
                  ? 'bg-cobalt/15 text-cobalt border border-cobalt/30' 
                  : 'text-slate-secondary hover:bg-white/5 hover:text-slate-primary'
              }`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                active ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              
              {!isCollapsed && (
                <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
              
              {active && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cobalt animate-pulse-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-white/6">
        <button
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-secondary hover:bg-white/5 hover:text-slate-primary transition-all duration-200"
          title="Settings"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-medium text-sm">Settings</span>
          )}
        </button>
      </div>
    </aside>
  );
}
