import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import { LocationContext } from '../context/AppProviders';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const serviceColors = {
  Hospital: 'red',
  Police: 'blue',
  School: 'green',
  'Fire Station': 'orange',
  Library: 'purple',
  Park: 'yellow'
};

const PublicServices = () => {
  const locationCtx = useContext(LocationContext);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

  useEffect(() => {
    if (locationCtx.lat && locationCtx.lng) {
      setMapCenter([locationCtx.lat, locationCtx.lng]);
    }
  }, [locationCtx]);

  const [services, setServices] = useState([
    { type: 'Hospital', name: 'City Central Hospital', address: '123 Main St', pos: [51.505, -0.09] },
    { type: 'Police', name: 'Downtown Precinct', address: '456 Oak Ave', pos: [51.51, -0.1] },
    { type: 'School', name: 'Metro High School', address: '321 Pine Rd', pos: [51.515, -0.09] },
    { type: 'Fire Station', name: 'Station 4', address: '789 Elm Blvd', pos: [51.50, -0.08] }
  ]);

  useEffect(() => {
    api.get('/data/services')
      .then(res => {
        const center = [locationCtx.lat || 51.505, locationCtx.lng || -0.09];
        const mapped = res.data.map((s, i) => ({
          ...s,
          pos: [center[0] + (i * 0.005), center[1] + (i * 0.005)]
        }));
        setServices([{ type: 'You Are Here', name: 'My Current Location', address: locationCtx.city, pos: center, isMe: true }, ...mapped]);
      })
      .catch(() => {});
  }, [locationCtx]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Public Services Map</h2>
        <p className="text-slate-400 text-sm">Interactive visualization of essential city infrastructure</p>
      </div>

      <div className="flex-1 glass-panel p-2 relative z-0 rounded-2xl overflow-hidden border border-slate-700/50">
        {!locationCtx.loading ? (
        <MapContainer 
          key={`${mapCenter[0]}-${mapCenter[1]}`}
          center={mapCenter} 
          zoom={12} 
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem', background: '#0f172a' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap & CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {services.map((s, i) => (
            <React.Fragment key={i}>
              <Marker position={s.pos}>
                <Popup>
                  <div className="text-slate-800">
                    <strong>{s.name}</strong><br/>
                    {s.type}<br/>
                    {s.address}
                  </div>
                </Popup>
              </Marker>
              {!s.isMe && <Circle center={s.pos} radius={500} pathOptions={{ color: serviceColors[s.type] || 'blue', fillColor: serviceColors[s.type] || 'blue', fillOpacity: 0.1 }} />}
            </React.Fragment>
          ))}
          
          <Circle center={[mapCenter[0] + 0.008, mapCenter[1] - 0.005]} radius={800} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}>
            <Popup><div className="text-red-600 font-bold">Heavy Traffic Zone</div></Popup>
          </Circle>
        </MapContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400">Requesting GPS Coordinates...</div>
        )}
      </div>
      
      <div className="mt-4 flex gap-4 text-sm text-slate-400 flex-wrap">
        {Object.entries(serviceColors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1"><span className={`w-3 h-3 rounded-full bg-${color}-500`}></span> {type}</span>
        ))}
      </div>
    </div>
  );
};

export default PublicServices;