const express = require('express');
const router = express.Router();
const jwtUtil = require('../utils/jwt');

// Dummy user auth for demo
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Replace with DB validation
  if (username === 'admin' && password === '123456') {
    const token = jwtUtil.generateToken({ username });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
