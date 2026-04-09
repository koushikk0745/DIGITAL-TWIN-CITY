const express = require('express');
const router = express.Router();

let energyData = [];

router.get('/', (req, res) => res.json(energyData));
router.get('/latest', (req, res) => res.json({ 
  usageMW: (Math.random() * 100 + 400).toFixed(2),
  gridStatus: 'Stable',
  batteryStorage: Math.floor(Math.random() * 20) + 80,
  renewablePercentage: Math.floor(Math.random() * 30) + 30
}));
router.get('/history', (req, res) => res.json(energyData));

router.post('/', (req, res) => {
  const data = { ...req.body, timestamp: new Date() };
  energyData.push(data);
  res.status(201).json(data);
});

module.exports = router;