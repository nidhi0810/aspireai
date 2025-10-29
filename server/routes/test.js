const express = require('express');
const router = express.Router();

// Test route to verify API is working
router.get('/ping', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Test protected route
router.get('/protected', require('../middleware/auth'), (req, res) => {
  res.json({
    message: 'Protected route working!',
    userId: req.userId,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;