const express = require('express');
const router = express.Router();

const weatherData = {
  temp: 24,
  humidity: 65,
  windSpeed: 12,
  condition: 'Sunny',
  pressure: 1013,
  visibility: 10,
  uvIndex: 5,
  forecast: [
    { day: 'Mon', high: 26, low: 18, condition: 'Sunny' },
    { day: 'Tue', high: 24, low: 17, condition: 'Cloudy' },
    { day: 'Wed', high: 22, low: 15, condition: 'Rainy' },
    { day: 'Thu', high: 25, low: 16, condition: 'Partly Cloudy' },
    { day: 'Fri', high: 27, low: 19, condition: 'Sunny' },
    { day: 'Sat', high: 28, low: 20, condition: 'Sunny' },
    { day: 'Sun', high: 26, low: 18, condition: 'Cloudy' }
  ]
};

router.get('/weather', (req, res) => {
  res.json({
    ...weatherData,
    temp: (Math.random() * 15 + 15).toFixed(1),
    humidity: Math.floor(Math.random() * 40 + 40),
    windSpeed: (Math.random() * 10 + 5).toFixed(1),
    condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)]
  });
});

router.get('/forecast', (req, res) => {
  res.json(weatherData.forecast);
});

router.get('/news', (req, res) => {
  res.json([
    { title: 'New Smart Grid Activated in Downtown', source: 'City Tribune', time: '2 hours ago', category: 'Energy' },
    { title: 'Water Conservation Efforts Show 15% Reduction', source: 'Eco Daily', time: '5 hours ago', category: 'Water' },
    { title: 'Major Traffic Redirections for Weekend Festival', source: 'Metro News', time: '1 day ago', category: 'Traffic' },
    { title: 'City Launches Emergency Response App', source: 'Tech Today', time: '1 day ago', category: 'Emergency' },
    { title: 'New Recycling Centers Open in All Zones', source: 'Green City', time: '2 days ago', category: 'Waste' },
    { title: 'Air Quality Improves After New Regulations', source: 'Environmental Watch', time: '3 days ago', category: 'Pollution' }
  ]);
});

router.get('/services', (req, res) => {
  res.json([
    { type: 'Hospital', name: 'City Central Hospital', address: '123 Main St', phone: '555-0100', hours: '24/7' },
    { type: 'Police', name: 'Downtown Precinct', address: '456 Oak Ave', phone: '555-0101', hours: '24/7' },
    { type: 'Fire Station', name: 'Station 4', address: '789 Elm Blvd', phone: '555-0102', hours: '24/7' },
    { type: 'School', name: 'Metro High School', address: '321 Pine Rd', phone: '555-0103', hours: '8AM-4PM' },
    { type: 'Library', name: 'Central Library', address: '654 Maple Dr', phone: '555-0104', hours: '9AM-8PM' },
    { type: 'Park', name: 'City Park', address: '789 River Way', phone: 'N/A', hours: '6AM-10PM' }
  ]);
});

module.exports = router;