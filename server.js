const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./backend/models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

mongoose.connect('mongodb+srv://koushikk0745_db_user:koushik_2006@cluster0.y6hy32y.mongodb.net/digitalTwin?appName=Cluster0')
  .then(() => console.log('MongoDB Connected to Root Server'))
  .catch(err => console.error('MongoDB Root Connection Error:', err));

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'digitaltwincity.dev@gmail.com', // Placeholder
    pass: process.env.EMAIL_PASS || 'your_gmail_app_password' // Placeholder
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, 'supersecretjwtkeyforsmartcity', { expiresIn: '30d' });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email: normalizedEmail, password });

    const mailOptions = {
      from: 'TWINCITY Operations',
      to: normalizedEmail,
      subject: 'Citizen ID Initialized - Welcome to TwinCity',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Welcome to TwinCity, ${name}!</h2>
          <p>Your Citizen ID has been successfully initialized. You can now access the operations dashboard.</p>
          <hr />
          <p><strong>Your Credentials:</strong></p>
          <p>Email: ${normalizedEmail}</p>
          <p>Status: Active</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Please use these credentials to log in at <a href="https://digital-twin-city.vercel.app/login">TwinCity Portal</a>.</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions).catch(err => console.log('Email Send Error:', err));

    res.status(201).json({ 
      success: true, 
      message: 'Citizen ID initialized. Please log in with your credentials.' 
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Error creating user: ' + err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password. Please check your spelling or sign up first.' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Feedback Routes
app.get('/api/feedback', (req, res) => res.json(feedbacks.slice().reverse()));
app.post('/api/feedback', (req, res) => {
  const feedback = { _id: Date.now().toString(), ...req.body, status: 'pending', createdAt: new Date() };
  feedbacks.push(feedback);
  res.status(201).json(feedback);
});
app.put('/api/feedback/:id', (req, res) => {
  const idx = feedbacks.findIndex(f => f._id === req.params.id);
  if (idx !== -1) { feedbacks[idx].status = req.body.status; res.json(feedbacks[idx]); }
  else res.status(404).json({ message: 'Not found' });
});

// Complaint Routes
app.get('/api/complaint', (req, res) => res.json(complaints));
app.get('/api/complaint/pending', (req, res) => res.json(complaints.filter(c => c.status !== 'Resolved')));
app.post('/api/complaint', (req, res) => {
  const complaint = { id: Date.now().toString(), ...req.body, status: 'Pending', priority: 'Medium', date: 'Just now' };
  complaints.push(complaint);
  res.status(201).json(complaint);
});
app.put('/api/complaint/:id/status', (req, res) => {
  const idx = complaints.findIndex(c => c.id === req.params.id);
  if (idx !== -1) { complaints[idx].status = req.body.status; res.json(complaints[idx]); }
  else res.status(404).json({ message: 'Not found' });
});

// Emergency Routes
app.get('/api/emergency', (req, res) => res.json(emergencies));
app.get('/api/emergency/active', (req, res) => res.json(emergencies.filter(e => e.status !== 'Resolved')));
app.post('/api/emergency', (req, res) => {
  const emergency = { id: Date.now().toString(), ...req.body, timestamp: new Date() };
  emergencies.push(emergency);
  res.status(201).json(emergency);
});

// Data Routes
app.get('/api/data/weather', (req, res) => res.json({
  temp: (Math.random() * 15 + 15).toFixed(1),
  humidity: Math.floor(Math.random() * 40 + 40),
  windSpeed: (Math.random() * 10 + 5).toFixed(1),
  condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
  pressure: 1013, visibility: 10, uvIndex: 5
}));
app.get('/api/data/forecast', (req, res) => res.json([
  { day: 'Mon', high: 26, low: 18, condition: 'Sunny' },
  { day: 'Tue', high: 24, low: 17, condition: 'Cloudy' },
  { day: 'Wed', high: 22, low: 15, condition: 'Rainy' },
  { day: 'Thu', high: 25, low: 16, condition: 'Partly Cloudy' },
  { day: 'Fri', high: 27, low: 19, condition: 'Sunny' },
  { day: 'Sat', high: 28, low: 20, condition: 'Sunny' },
  { day: 'Sun', high: 26, low: 18, condition: 'Cloudy' }
]));
app.get('/api/data/news', (req, res) => res.json([
  { title: 'New Smart Grid Activated in Downtown', source: 'City Tribune', time: '2 hours ago', category: 'Energy' },
  { title: 'Water Conservation Efforts Show 15% Reduction', source: 'Eco Daily', time: '5 hours ago', category: 'Water' },
  { title: 'Major Traffic Redirections for Weekend Festival', source: 'Metro News', time: '1 day ago', category: 'Traffic' },
  { title: 'City Launches Emergency Response App', source: 'Tech Today', time: '1 day ago', category: 'Emergency' },
  { title: 'New Recycling Centers Open in All Zones', source: 'Green City', time: '2 days ago', category: 'Waste' },
  { title: 'Air Quality Improves After New Regulations', source: 'Environmental Watch', time: '3 days ago', category: 'Pollution' }
]));
app.get('/api/data/services', (req, res) => res.json([
  { type: 'Hospital', name: 'City Central Hospital', address: '123 Main St', phone: '555-0100', hours: '24/7' },
  { type: 'Police', name: 'Downtown Precinct', address: '456 Oak Ave', phone: '555-0101', hours: '24/7' },
  { type: 'Fire Station', name: 'Station 4', address: '789 Elm Blvd', phone: '555-0102', hours: '24/7' },
  { type: 'School', name: 'Metro High School', address: '321 Pine Rd', phone: '555-0103', hours: '8AM-4PM' },
  { type: 'Library', name: 'Central Library', address: '654 Maple Dr', phone: '555-0104', hours: '9AM-8PM' }
]));

// Other Module Routes (mock data)
app.get('/api/traffic', (req, res) => res.json([
  { zone: 'North', volume: 65, capacity: 100, incidents: 1 },
  { zone: 'South', volume: 85, capacity: 100, incidents: 2 },
  { zone: 'East', volume: 45, capacity: 100, incidents: 0 },
  { zone: 'West', volume: 55, capacity: 100, incidents: 1 },
  { zone: 'Downtown', volume: 95, capacity: 100, incidents: 3 }
]));
app.get('/api/traffic/latest', (req, res) => res.json({ zone: 'All', level: 65, incidents: 2 }));

app.get('/api/pollution/latest', (req, res) => res.json({ aqi: Math.floor(Math.random() * 50) + 30, pm25: 12, status: 'Good' }));

app.get('/api/water/latest', (req, res) => res.json({ tankLevel: Math.floor(Math.random() * 20) + 70, pressure: 45, quality: 98, status: 'Normal' }));
app.get('/api/water/sectors', (req, res) => res.json([
  { sector: 'North', level: 85, status: 'Normal' },
  { sector: 'South', level: 78, status: 'Normal' },
  { sector: 'East', level: 92, status: 'Normal' },
  { sector: 'West', level: 70, status: 'Warning' }
]));

app.get('/api/energy/latest', (req, res) => res.json({ usageMW: 450, gridStatus: 'Stable', batteryStorage: 84, renewablePercentage: 35 }));
app.get('/api/energy/history', (req, res) => res.json(Array.from({length:20}, (_,i) => ({ time: `10:${i}0`, mw: 400 + Math.random() * 50 }))));

app.get('/api/waste/latest', (req, res) => res.json({ collected: 125, recycled: 45, efficiency: 92, landfill: 60, organic: 20 }));

app.get('/api/weather/latest', (req, res) => res.json({ temp: 24, humidity: 65, windSpeed: 12, condition: 'Sunny' }));

// Serve SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => {
  io.emit('city-data', {
    traffic: { level: Math.floor(Math.random() * 100), incidents: Math.floor(Math.random() * 5) },
    energy: { usageMW: (Math.random() * 100 + 400).toFixed(2), gridStatus: 'Stable', batteryStorage: Math.floor(Math.random() * 20 + 80) },
    water: { tankLevel: (Math.random() * 20 + 70).toFixed(2), pressure: (Math.random() * 10 + 40).toFixed(2) },
    aqi: { index: Math.floor(Math.random() * 50) + 30, status: 'Good' },
    waste: { collected: Math.floor(Math.random() * 50 + 100), recycled: Math.floor(Math.random() * 20 + 30), efficiency: Math.floor(Math.random() * 10 + 85) },
    weather: { temp: (Math.random() * 15 + 15).toFixed(1), humidity: Math.floor(Math.random() * 40 + 40), condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)] },
    timestamp: new Date()
  });
}, 3000);

setInterval(() => {
  const alerts = [
    { type: 'warning', msg: 'Heavy traffic on Main St.' },
    { type: 'danger', msg: 'Fire reported in Sector 4!' },
    { type: 'info', msg: 'Power maintenance in Sector 2.' },
    { type: 'success', msg: 'Water pipeline repaired.' },
    { type: 'warning', msg: 'AQI rising in Industrial zone.' }
  ];
  if (Math.random() > 0.7) io.emit('city-alert', { ...alerts[Math.floor(Math.random() * alerts.length)], timestamp: new Date() });
}, 15000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));