require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/data', require('./routes/data'));

app.use('/api/traffic', require('./routes/traffic'));
app.use('/api/pollution', require('./routes/pollution'));
app.use('/api/water', require('./routes/water'));
app.use('/api/energy', require('./routes/energy'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/waste', require('./routes/waste'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/complaint', require('./routes/complaint'));

let connectedClients = 0;

io.on('connection', (socket) => {
  connectedClients++;
  console.log(`Client connected. Total: ${connectedClients}`);

  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`Client disconnected. Total: ${connectedClients}`);
  });
});

setInterval(() => {
  const trafficData = {
    level: Math.floor(Math.random() * 100),
    incidents: Math.floor(Math.random() * 5),
    zones: [
      { zone: 'North', volume: Math.floor(Math.random() * 100) },
      { zone: 'South', volume: Math.floor(Math.random() * 100) },
      { zone: 'East', volume: Math.floor(Math.random() * 100) },
      { zone: 'West', volume: Math.floor(Math.random() * 100) },
      { zone: 'Downtown', volume: Math.floor(Math.random() * 100) }
    ]
  };
  
  const energyData = {
    usageMW: (Math.random() * 100 + 400).toFixed(2),
    gridStatus: 'Stable',
    batteryStorage: Math.floor(Math.random() * 20 + 80),
    renewablePercentage: Math.floor(Math.random() * 30 + 30)
  };

  const waterData = {
    tankLevel: (Math.random() * 20 + 70).toFixed(2),
    pressure: (Math.random() * 10 + 40).toFixed(2),
    quality: Math.floor(Math.random() * 5 + 95)
  };

  const aqiData = {
    index: Math.floor(Math.random() * 50) + 30,
    status: 'Good',
    pm25: Math.floor(Math.random() * 20 + 5),
    pm10: Math.floor(Math.random() * 30 + 10)
  };

  const wasteData = {
    collected: Math.floor(Math.random() * 50 + 100),
    recycled: Math.floor(Math.random() * 20 + 30),
    efficiency: Math.floor(Math.random() * 10 + 85)
  };

  const weatherData = {
    temp: (Math.random() * 15 + 15).toFixed(1),
    humidity: Math.floor(Math.random() * 40 + 40),
    windSpeed: (Math.random() * 10 + 5).toFixed(1),
    condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)]
  };

  const emergencyData = {
    active: Math.floor(Math.random() * 3 + 1),
    fireUnits: Math.floor(Math.random() * 5 + 5),
    ambulances: Math.floor(Math.random() * 8 + 4),
    policeUnits: Math.floor(Math.random() * 10 + 5)
  };

  io.emit('city-data', {
    traffic: trafficData,
    energy: energyData,
    water: waterData,
    aqi: aqiData,
    waste: wasteData,
    weather: weatherData,
    emergency: emergencyData,
    timestamp: new Date()
  });

}, 3000);

setInterval(() => {
  const alerts = [
    { type: 'warning', msg: 'Heavy traffic reported on Main St.' },
    { type: 'danger', msg: 'Fire reported in Sector 4! Fire trucks dispatched.' },
    { type: 'info', msg: 'Scheduled power maintenance in Sector 2 at 14:00.' },
    { type: 'success', msg: 'Water pipeline repaired in downtown area.' },
    { type: 'warning', msg: 'Air quality index rising in Industrial zone.' },
    { type: 'info', msg: 'Waste collection completed in North Zone.' }
  ];
  
  if (Math.random() > 0.7) {
    const alert = alerts[Math.floor(Math.random() * alerts.length)];
    io.emit('city-alert', { ...alert, timestamp: new Date() });
  }
}, 15000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));