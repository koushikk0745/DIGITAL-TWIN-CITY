import React, { useEffect, useState, useContext } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';
import api from '../services/api';
import { LocationContext } from '../context/AppProviders';

const Weather = () => {
  const locationCtx = useContext(LocationContext);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (!locationCtx.lat || !locationCtx.lng) return;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${locationCtx.lat}&longitude=${locationCtx.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const c = data.current;
        let cStr = 'Sunny';
        if (c.weather_code > 50) cStr = 'Rainy';
        else if (c.weather_code > 1) cStr = 'Cloudy';

        setWeather({
          temp: c.temperature_2m,
          humidity: c.relative_humidity_2m,
          windSpeed: c.wind_speed_10m,
          condition: cStr
        });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const fc = data.daily.time.slice(0, 5).map((t, i) => {
          const d = new Date(t);
          return {
            day: days[d.getDay()],
            high: data.daily.temperature_2m_max[i],
            low: data.daily.temperature_2m_min[i]
          };
        });
        setForecast(fc);
      })
      .catch(console.error);
  }, [locationCtx]);

  if (!weather) return <div className="p-6 text-slate-400">Loading Weather Data...</div>;

  const Icon = weather.condition === 'Sunny' ? Sun : weather.condition === 'Rainy' ? CloudRain : Cloud;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{locationCtx?.city ? locationCtx.city.split(',')[0] : 'City'} Weather Center</h2>
        <p className="text-slate-400 text-sm">Real-time meteorological monitoring</p>
      </div>

      <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-slate-800/80 to-blue-900/40 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-6 relative z-10">
          <Icon size={80} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          <div>
            <h3 className="text-5xl font-bold text-white mb-2">{weather.temp}°C</h3>
            <p className="text-xl text-cyan-200 font-medium">{weather.condition}</p>
          </div>
        </div>

        <div className="flex gap-8 mt-8 md:mt-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-800 rounded-lg">
              <Droplets className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Humidity</p>
              <p className="text-xl font-bold text-white">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-800 rounded-lg">
              <Wind className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Wind</p>
              <p className="text-xl font-bold text-white">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Area */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.isArray(forecast) && forecast.length > 0 ? forecast.map((day, i) => (
          <div key={i} className="glass-panel p-4 text-center">
            <p className="text-slate-400 text-sm mb-3">{day.day}</p>
            <Cloud size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-lg font-bold text-white">{day.high}° / {day.low}°</p>
          </div>
        )) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
          <div key={day} className="glass-panel p-4 text-center">
            <p className="text-slate-400 text-sm mb-3">{day}</p>
            <Cloud size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-lg font-bold text-white">{Math.floor(weather.temp - 2 + i)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
