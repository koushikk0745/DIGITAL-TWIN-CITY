const express = require('express');
const router = express.Router();

let pollutionData = [];

router.get('/', (req, res) => res.json(pollutionData));
router.get('/latest', (req, res) => res.json({ 
  aqi: Math.floor(Math.random() * 50) + 30, 
  pm25: Math.floor(Math.random() * 20) + 5,
  pm10: Math.floor(Math.random() * 30) + 10,
  status: 'Good' 
}));
router.get('/history', (req, res) => res.json(pollutionData));

router.post('/', (req, res) => {
  const data = { ...req.body, timestamp: new Date() };
  pollutionData.push(data);
  res.status(201).json(data);
});

module.exports = router;