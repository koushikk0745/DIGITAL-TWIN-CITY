import React, { useContext, useEffect, useState } from 'react';
import { SocketContext, LocationContext } from '../context/AppProviders';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Car, Wind, Droplets, Trash2, Siren, Cloud } from 'lucide-react';

const StatCard = ({ title, value, unit, status, icon: Icon, colorClass }) => (
  <div className="glass-panel p-5 flex flex-col justify-between hover:border-slate-500/50 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${colorClass || 'bg-blue-500/10'} group-hover:scale-110 transition-transform`}>
        {Icon && <Icon size={20} className={colorClass?.replace('bg-', 'text-').replace('/10', '') || 'text-blue-400'} />}
      </div>
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
        status === 'Good' || status === 'Stable' || status === 'Normal' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
        status === 'Warning' || status === 'Rainy' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
        status === 'Danger' || status === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      }`}>
        {status || 'Normal'}
      </span>
    </div>
    <div>
      <h3 className="text-slate-400 font-medium text-xs mb-1 uppercase tracking-tight">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        <span className="text-slate-500 text-xs font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

const AnalyticsHub = () => {
  const socket = useContext(SocketContext);
  const locationCtx = useContext(LocationContext);
  const [cityData, setCityData] = useState({
    traffic: { level: 45 },
    energy: { usageMW: 450, gridStatus: 'Stable' },
    water: { tankLevel: 80 },
    aqi: { index: 42, status: 'Good' },
    waste: { collected: 120, efficiency: 94 },
    weather: { temp: 24, condition: 'Sunny' },
    emergency: { active: 2 }
  });

  const [energyHistory, setEnergyHistory] = useState(
    Array.from({ length: 10 }).map((_, i) => ({ time: `${10 + i}:00`, mw: 400 + Math.random() * 50 }))
  );

  useEffect(() => {
    if (!socket) return;

    socket.on('city-data', (data) => {
      setCityData(prev => ({
        ...prev,
        ...data,
        weather: data.weather || prev.weather
      }));
      
      setEnergyHistory(prev => {
        const newHistory = [...prev, { 
          time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
          mw: parseFloat(data.energy.usageMW) 
        }];
        if (newHistory.length > 20) newHistory.shift();
        return newHistory;
      });
    });

    return () => socket.off('city-data');
  }, [socket]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">City Operations Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            Real-time infrastructure monitoring for <span className="text-cyan-400 font-semibold">{locationCtx?.city || 'Digital Twin City'}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 glass-panel text-xs text-slate-300">
             <span className="text-slate-500">Last Sync:</span> 
             {new Date().toLocaleTimeString()}
          </div>
          <span className="flex items-center gap-2 px-3 py-1.5 glass-panel text-xs text-green-400 border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live Connection
          </span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard title="Energy Load" value={cityData.energy.usageMW} unit="MW" status={cityData.energy.gridStatus} icon={Zap} colorClass="bg-yellow-500/10" />
        <StatCard title="Traffic" value={`${cityData.traffic.level}%`} unit="Load" status={cityData.traffic.level > 70 ? 'Warning' : 'Normal'} icon={Car} colorClass="bg-blue-500/10" />
        <StatCard title="Air Quality" value={cityData.aqi.index} unit="AQI" status={cityData.aqi.status} icon={Wind} colorClass="bg-green-500/10" />
        <StatCard title="Water Level" value={`${cityData.water.tankLevel}%`} unit="Full" status="Stable" icon={Droplets} colorClass="bg-cyan-500/10" />
        <StatCard title="Waste Collected" value={cityData.waste.collected} unit="Tons" status={`${cityData.waste.efficiency}% Eff.`} icon={Trash2} colorClass="bg-purple-500/10" />
        <StatCard title="Local Weather" value={`${cityData.weather.temp}°C`} unit="" status={cityData.weather.condition} icon={Cloud} colorClass="bg-indigo-500/10" />
        <StatCard title="Emergencies" value={cityData.emergency?.active || cityData.traffic.incidents || 0} unit="Active" status={(cityData.emergency?.active || cityData.traffic.incidents) > 0 ? 'Danger' : 'Stable'} icon={Siren} colorClass="bg-red-500/10" />
      </div>

      {/* Analytics Visualization Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass-panel p-6 xl:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-white font-semibold">Consolidated Infrastructure Usage</h3>
              <p className="text-slate-400 text-xs mt-1">Real-time usage patterns across the grid</p>
            </div>
            <div className="flex gap-4 text-xs">
               <div className="flex items-center gap-1.5 text-cyan-400"><div className="w-3 h-3 rounded-sm bg-cyan-400/20 border border-cyan-400/50"></div> Energy (MW)</div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyHistory}>
                <defs>
                  <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="mw" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorGrid)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 relative flex flex-col items-center justify-center overflow-hidden min-h-[380px]">
          <div className="absolute top-0 right-0 p-4">
             <Droplets className="text-blue-500/20" size={120} />
          </div>
          
          <div className="relative z-10 w-full">
            <h3 className="text-white font-semibold mb-2">Resource Sustainability</h3>
            <p className="text-slate-400 text-xs mb-8">Main Reservoir monitoring</p>
            
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full border-[6px] border-slate-800/80 p-2 shadow-2xl relative">
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden relative border-2 border-slate-700">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-[2000ms] ease-out shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    style={{ height: `${cityData.water.tankLevel}%` }}
                  >
                     <div className="absolute top-0 w-full h-2 bg-white/20 blur-[1px]"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-extrabold text-white tracking-tighter">{cityData.water.tankLevel}</span>
                      <span className="text-xl text-cyan-300 font-bold ml-1">%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Capacity</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-8 w-full">
                 <div className="text-center">
                    <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Pressure</p>
                    <p className="text-white font-bold">{cityData.water.pressure || 42} <span className="text-slate-400 text-xs">PSI</span></p>
                 </div>
                 <div className="text-center">
                    <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Purity</p>
                    <p className="text-green-400 font-bold">{cityData.water.quality || 98}<span className="text-slate-400 text-xs">%</span></p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHub;

