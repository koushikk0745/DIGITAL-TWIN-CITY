const express = require('express');
const router = express.Router();

let waterData = [];

router.get('/', (req, res) => res.json(waterData));
router.get('/latest', (req, res) => res.json({ 
  tankLevel: Math.floor(Math.random() * 20) + 70, 
  pressure: (Math.random() * 10 + 40).toFixed(1),
  quality: Math.floor(Math.random() * 5) + 95,
  status: 'Normal' 
}));
router.get('/sectors', (req, res) => res.json([
  { sector: 'North', level: 85, status: 'Normal' },
  { sector: 'South', level: 78, status: 'Normal' },
  { sector: 'East', level: 92, status: 'Normal' },
  { sector: 'West', level: 70, status: 'Warning' }
]));

router.post('/', (req, res) => {
  const data = { ...req.body, timestamp: new Date() };
  waterData.push(data);
  res.status(201).json(data);
});

module.exports = router;