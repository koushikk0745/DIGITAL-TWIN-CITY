import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, SocketContext } from '../context/AppProviders';
import { Bell, Search, User, X, AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const modules = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Weather', path: '/weather', icon: '🌤️' },
    { name: 'Air Quality', path: '/aqi', icon: '💨' },
    { name: 'Traffic', path: '/traffic', icon: '🚗' },
    { name: 'Energy', path: '/energy', icon: '⚡' },
    { name: 'Water', path: '/water', icon: '💧' },
    { name: 'Waste', path: '/waste', icon: '🗑️' },
    { name: 'Emergency', path: '/emergency', icon: '🚨' },
    { name: 'Complaints', path: '/complaint', icon: '📝' },
    { name: 'Alerts', path: '/alerts', icon: '🔔' },
    { name: 'Services', path: '/services', icon: '🏛️' },
    { name: 'News', path: '/news', icon: '📰' },
    { name: 'Feedback', path: '/feedback', icon: '💬' },
  ];

  useEffect(() => {
    if (!socket) return;
    socket.on('city-alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 50));
      setUnreadAlerts(prev => prev + 1);
    });
    return () => socket.off('city-alert');
  }, [socket]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const filteredModules = modules.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModuleClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getAlertStyle = (type) => {
    switch(type) {
      case 'danger': return { bg: 'bg-red-500/20', border: 'border-red-500/30', icon: <ShieldAlert size={16} className="text-red-400" /> };
      case 'warning': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: <AlertTriangle size={16} className="text-yellow-400" /> };
      case 'success': return { bg: 'bg-green-500/20', border: 'border-green-500/30', icon: <CheckCircle size={16} className="text-green-400" /> };
      default: return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: <Info size={16} className="text-blue-400" /> };
    }
  };

  const clearAlerts = () => {
    setUnreadAlerts(0);
    setAlerts([]);
  };

  return (
    <header className="h-16 glass-panel rounded-none border-t-0 border-l-0 border-r-0 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="relative flex-1 md:flex-none">
        <div className="flex items-center bg-slate-900/50 border border-slate-700/50 rounded-lg px-2 py-1.5 w-auto md:w-64">
          <Search size={18} className="text-slate-400 md:mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none text-sm focus:outline-none w-0 md:w-full md:block focus:w-40 transition-all text-slate-200 placeholder-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white cursor-pointer ml-1">
              <X size={14} />
            </button>
          )}
        </div>

        {showSearchResults && (
          <div className="absolute top-full left-0 mt-2 w-80 glass-panel rounded-lg overflow-hidden max-h-80 overflow-y-auto z-50">
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <button
                  key={module.path}
                  onClick={() => handleModuleClick(module.path)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-700/50 flex items-center gap-3 border-b border-slate-700/50 last:border-0 cursor-pointer"
                >
                  <span className="text-lg">{module.icon}</span>
                  <span className="text-slate-200">{module.name}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-slate-400 text-center">No modules found</div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative cursor-pointer hover:scale-110 transition-transform"
          >
            <Bell size={20} className="text-slate-300 hover:text-white transition-colors" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {unreadAlerts > 9 ? '9+' : unreadAlerts}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute top-full right-0 mt-2 w-96 glass-panel rounded-lg overflow-hidden z-50 max-h-[500px] overflow-y-auto">
              <div className="p-4 border-b border-slate-700/50 flex justify-between items-center sticky top-0 bg-slate-800">
                <h3 className="text-white font-bold">Notifications ({alerts.length})</h3>
                {alerts.length > 0 && (
                  <button onClick={clearAlerts} className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    Clear All
                  </button>
                )}
              </div>
              {alerts.length === 0 ? (
                <div className="p-4 text-slate-400 text-center">No notifications yet</div>
              ) : (
                alerts.map((alert, idx) => {
                  const style = getAlertStyle(alert.type);
                  return (
                    <div key={idx} className={`p-3 border-b border-slate-700/30 ${style.bg} border-l-2 ${style.border}`}>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5">{style.icon}</span>
                        <div>
                          <p className="text-sm text-slate-200">{alert.msg}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div className="p-3 border-t border-slate-700/50">
                <button 
                  onClick={() => { navigate('/alerts'); setShowAlerts(false); }}
                  className="w-full text-center text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 border-l border-slate-700 pl-6 hover:bg-slate-800/50 px-4 py-2 rounded-lg transition-colors">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-200">{user?.name || 'Explorer'}</p>
            <p className="text-xs text-slate-400 capitalize">City Resident</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border border-slate-600">
            <User size={18} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;