const express = require('express');
const router = express.Router();

let wasteData = [];

router.get('/', (req, res) => res.json(wasteData));
router.get('/latest', (req, res) => res.json({ 
  collected: Math.floor(Math.random() * 50) + 100, 
  recycled: Math.floor(Math.random() * 20) + 30,
  efficiency: Math.floor(Math.random() * 10) + 85,
  landfill: Math.floor(Math.random() * 30) + 40,
  organic: Math.floor(Math.random() * 15) + 15
}));
router.get('/stats', (req, res) => res.json(wasteData));

router.post('/', (req, res) => {
  const data = { ...req.body, timestamp: new Date() };
  wasteData.push(data);
  res.status(201).json(data);
});

module.exports = router;