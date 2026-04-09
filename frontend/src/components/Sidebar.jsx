import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CloudRain, Wind, TrafficCone, Zap, Droplet, Bell, Map, MessageSquare, Newspaper, LogOut, Trash2, Siren, AlertCircle } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext, LocationContext } from '../context/AppProviders';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const locationCtx = useContext(LocationContext);
  const navigate = useNavigate();

  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Weather', path: '/weather', icon: <CloudRain size={20} /> },
    { name: 'Air Quality', path: '/aqi', icon: <Wind size={20} /> },
    { name: 'Traffic', path: '/traffic', icon: <TrafficCone size={20} /> },
    { name: 'Energy', path: '/energy', icon: <Zap size={20} /> },
    { name: 'Water', path: '/water', icon: <Droplet size={20} /> },
    { name: 'Waste', path: '/waste', icon: <Trash2 size={20} /> },
    { name: 'Emergency', path: '/emergency', icon: <Siren size={20} /> },
    { name: 'Complaints', path: '/complaint', icon: <AlertCircle size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <Bell size={20} /> },
    { name: 'Services', path: '/services', icon: <Map size={20} /> },
    { name: 'News', path: '/news', icon: <Newspaper size={20} /> },
    { name: 'Feedback', path: '/feedback', icon: <MessageSquare size={20} /> },
  ];

  return (
    <aside className="w-64 h-full glass-panel rounded-none border-t-0 border-b-0 border-l-0 flex flex-col pt-6 pb-4">
      <div className="px-6 mb-8 flex items-center gap-4 group">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-0.5 bg-cyan-400 rounded-full mb-0.5"></div>
          <div className="w-0.5 h-6 bg-blue-600 rounded-full"></div>
        </div>
        <h1 className="text-xl font-bold text-slate-100 tracking-tight truncate" title={locationCtx?.city}>
          Twin<span className="text-blue-500">City</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mb-6">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`
            }
          >
            {link.icon}
            <span className="font-medium text-sm">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button 
          onClick={() => { logout(); navigate('/login'); }} 
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
