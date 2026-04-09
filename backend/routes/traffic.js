const express = require('express');
const router = express.Router();

let trafficData = [
  { zone: 'North', volume: 65, capacity: 100, incidents: 1 },
  { zone: 'South', volume: 85, capacity: 100, incidents: 2 },
  { zone: 'East', volume: 45, capacity: 100, incidents: 0 },
  { zone: 'West', volume: 55, capacity: 100, incidents: 1 },
  { zone: 'Downtown', volume: 95, capacity: 100, incidents: 3 }
];

router.get('/', (req, res) => res.json(trafficData));
router.get('/latest', (req, res) => res.json({ zone: 'All', level: 65, incidents: 2 }));
router.get('/zones', (req, res) => res.json(trafficData));

router.post('/', (req, res) => {
  const data = { ...req.body, timestamp: new Date() };
  trafficData.push(data);
  res.status(201).json(data);
});

module.exports = router;