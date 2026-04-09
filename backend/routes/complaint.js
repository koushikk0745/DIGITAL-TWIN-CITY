const express = require('express');
const router = express.Router();

let complaints = [
  { id: '1', category: 'Infrastructure', title: 'Pothole on Main Street', description: 'Large pothole causing traffic issues', location: 'Main St', status: 'In Progress', priority: 'High', date: '2 hours ago' },
  { id: '2', category: 'Sanitation', title: 'Missed garbage collection', description: 'Garbage not collected for 3 days', location: 'Sector 5', status: 'Pending', priority: 'Medium', date: '5 hours ago' },
  { id: '3', category: 'Noise', title: 'Construction noise violation', description: 'Construction happening after permitted hours', location: 'Downtown', status: 'Resolved', priority: 'Low', date: '1 day ago' },
  { id: '4', category: 'Traffic', title: 'Broken traffic signal', description: 'Traffic light not working at intersection', location: '5th Ave & Main', status: 'In Progress', priority: 'High', date: '1 day ago' }
];

router.get('/', (req, res) => res.json(complaints));
router.get('/pending', (req, res) => res.json(complaints.filter(c => c.status !== 'Resolved')));

router.post('/', (req, res) => {
  const complaint = { 
    ...req.body, 
    id: Date.now().toString(),
    status: 'Pending',
    priority: 'Medium',
    date: 'Just now'
  };
  complaints.push(complaint);
  res.status(201).json(complaint);
});

router.put('/:id/status', (req, res) => {
  const { status, resolution } = req.body;
  const idx = complaints.findIndex(c => c.id === req.params.id);
  if (idx !== -1) {
    complaints[idx].status = status;
    if (resolution) complaints[idx].resolution = resolution;
    res.json(complaints[idx]);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;