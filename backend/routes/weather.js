const express = require('express');
const router = express.Router();

const weatherForecast = [
  { day: 'Mon', high: 26, low: 18, condition: 'Sunny' },
  { day: 'Tue', high: 24, low: 17, condition: 'Cloudy' },
  { day: 'Wed', high: 22, low: 15, condition: 'Rainy' },
  { day: 'Thu', high: 25, low: 16, condition: 'Partly Cloudy' },
  { day: 'Fri', high: 27, low: 19, condition: 'Sunny' },
  { day: 'Sat', high: 28, low: 20, condition: 'Sunny' },
  { day: 'Sun', high: 26, low: 18, condition: 'Cloudy' }
];

router.get('/', (req, res) => res.json(weatherForecast));
router.get('/latest', (req, res) => res.json({ 
  temp: (Math.random() * 15 + 15).toFixed(1),
  humidity: Math.floor(Math.random() * 40 + 40),
  windSpeed: (Math.random() * 10 + 5).toFixed(1),
  condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
  pressure: Math.floor(Math.random() * 20) + 1010,
  visibility: Math.floor(Math.random() * 5) + 8
}));
router.get('/forecast', (req, res) => res.json(weatherForecast));

router.post('/', (req, res) => {
  const data = { ...req.body, timestamp: new Date() };
  res.status(201).json(data);
});

module.exports = router;