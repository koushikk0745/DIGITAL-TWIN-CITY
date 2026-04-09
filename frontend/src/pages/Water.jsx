import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/AppProviders';
import { Droplet, Waves, AlertTriangle } from 'lucide-react';

const Water = () => {
  const socket = useContext(SocketContext);
  const [waterData, setWaterData] = useState({ tankLevel: 80, pressure: 45 });

  useEffect(() => {
    if (!socket) return;
    socket.on('city-data', (data) => {
      setWaterData(data.water);
    });
    return () => socket.off('city-data');
  }, [socket]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Water Resources Management</h2>
        <p className="text-slate-400 text-sm">Monitor distribution, pressure, and reserves</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Droplet className="text-blue-400"/> Primary Reservoir
            </h3>
          </div>
          
          <div className="w-48 h-64 border-4 border-slate-700 rounded-b-3xl relative overflow-hidden mt-8 shadow-inner shadow-black/50 bg-slate-900/50">
            {/* Animated water fill */}
            <div 
              className="absolute bottom-0 w-full bg-blue-500/80 transition-all duration-[2000ms] ease-in-out flex items-start justify-center pt-2"
              style={{ height: `${waterData.tankLevel}%` }}
            >
              <div className="w-full absolute top-[-10px] h-5 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxwaGF0IGQ9Ik0wIDBjMjAgMCAzMCAxMCA1MCAxMHMzMC0xMCA1MC0xMHYxMEgweiIgZmlsbD0iIzNiOGJmNiIvPjwvc3ZnPg==')] bg-repeat-x animate-[wave_3s_linear_infinite]"></div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className="text-4xl font-bold text-white">{waterData.tankLevel}</span><span className="text-xl text-blue-400">%</span>
            <p className="text-slate-400 text-sm mt-1">Capacity</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">System Pressure</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{waterData.pressure}</span>
                <span className="text-slate-500">PSI</span>
              </div>
            </div>
            <Waves size={40} className="text-cyan-400 opacity-50" />
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-white font-medium mb-4 text-lg">Sector Distribution</h3>
            <div className="space-y-4">
              {['North', 'South', 'Industrial', 'Downtown'].map((sector, i) => (
                <div key={sector}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{sector}</span>
                    <span className="text-blue-400 font-medium">Stable</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${80 - i * 10 + Math.random() * 5}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {waterData.tankLevel < 50 && (
             <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-4">
               <AlertTriangle className="text-red-400 shrink-0" />
               <div>
                 <p className="text-red-400 font-bold mb-1">Low Reserve Alert</p>
                 <p className="text-slate-300 text-sm">Reserves have fallen below 50%. Water conservation protocols should be initiated.</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Water;
