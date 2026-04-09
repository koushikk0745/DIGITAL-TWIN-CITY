const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const user = { _id: Date.now().toString(), name, email, password, role: 'user' };
  users.push(user);
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } else {
    const mockUser = { _id: '1', name: 'Demo Admin', email: 'admin@city.com', role: 'admin', token: generateToken('1') };
    res.json(mockUser);
  }
});

module.exports = router;