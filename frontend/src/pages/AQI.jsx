import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/AppProviders';

const AQI = () => {
  const socket = useContext(SocketContext);
  const [aqiData, setAqiData] = useState({ index: 45, pm25: 18, pm10: 24 });

  useEffect(() => {
    if (!socket) return;
    socket.on('city-data', (data) => {
      if (data.aqi) {
        setAqiData(data.aqi);
      }
    });
    return () => socket.off('city-data');
  }, [socket]);

  const getAqiDetails = (val) => {
    if (val <= 50) return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500', label: 'Good', msg: 'Air quality is satisfactory. Enjoy outdoor activities.' };
    if (val <= 100) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500', label: 'Moderate', msg: 'Acceptable quality. Sensitive groups should monitor.' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500', label: 'Unhealthy', msg: 'Everyone may begin to experience health effects. Limit outdoors.' };
  };

  const details = getAqiDetails(aqiData.index);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Air Quality Index (AQI)</h2>
        <p className="text-slate-400 text-sm">Real-time localized air monitors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-10 flex flex-col items-center justify-center text-center">
          <div className={`w-64 h-64 rounded-full border-8 ${details.border} flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
            <span className="text-slate-400 text-sm mb-2">Current AQI</span>
            <span className={`text-6xl font-bold ${details.color}`}>{aqiData.index}</span>
            <span className="mt-2 px-3 py-1 bg-slate-800 rounded-full text-sm font-medium text-slate-300">{details.label}</span>
          </div>
        </div>

        <div className="glass-panel p-8 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-white mb-4">Health Recommendation</h3>
          <div className={`p-4 rounded-lg border ${details.border} ${details.bg} mb-8`}>
            <p className={details.color}>{details.msg}</p>
          </div>

          <h4 className="text-slate-300 font-medium mb-4">Pollutant Breakdown</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-400"><p>PM2.5</p><p>{aqiData.pm25} µg/m³</p></div>
              <div className="w-full bg-slate-700 h-2 rounded"><div className="bg-cyan-500 h-2 rounded" style={{ width: `${Math.min((aqiData.pm25 / 50) * 100, 100)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-400"><p>PM10</p><p>{aqiData.pm10} µg/m³</p></div>
              <div className="w-full bg-slate-700 h-2 rounded"><div className="bg-blue-500 h-2 rounded" style={{ width: `${Math.min((aqiData.pm10 / 100) * 100, 100)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-400"><p>O3 (Ozone)</p><p>42 ppb</p></div>
              <div className="w-full bg-slate-700 h-2 rounded"><div className="bg-purple-500 h-2 rounded" style={{ width: '20%' }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQI;
