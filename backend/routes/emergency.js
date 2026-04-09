const express = require('express');
const router = express.Router();

let emergencies = [
  { id: '1', type: 'Fire', severity: 'High', location: 'Sector 4, Industrial Area', time: '10 min ago', status: 'Dispatched', units: 3 },
  { id: '2', type: 'Medical', severity: 'Medium', location: 'Main St. & 5th Ave', time: '25 min ago', status: 'On Scene', units: 1 }
];

router.get('/', (req, res) => res.json(emergencies));
router.get('/active', (req, res) => res.json(emergencies.filter(e => e.status !== 'Resolved')));

router.post('/', (req, res) => {
  const emergency = { ...req.body, id: Date.now().toString(), timestamp: new Date() };
  emergencies.push(emergency);
  res.status(201).json(emergency);
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const idx = emergencies.findIndex(e => e.id === req.params.id);
  if (idx !== -1) {
    emergencies[idx].status = status;
    res.json(emergencies[idx]);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;