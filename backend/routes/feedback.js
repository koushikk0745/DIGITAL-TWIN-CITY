const express = require('express');
const router = express.Router();

let feedbacks = [];

router.post('/', (req, res) => {
  const { category, description, location } = req.body;
  const feedback = {
    _id: Date.now().toString(),
    category: category || 'infrastructure',
    description,
    location,
    status: 'pending',
    createdAt: new Date()
  };
  feedbacks.push(feedback);
  res.status(201).json(feedback);
});

router.get('/', (req, res) => {
  res.json(feedbacks.slice().reverse());
});

router.put('/:id', (req, res) => {
  const { status } = req.body;
  const idx = feedbacks.findIndex(f => f._id === req.params.id);
  if (idx !== -1) {
    feedbacks[idx].status = status;
    res.json(feedbacks[idx]);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;