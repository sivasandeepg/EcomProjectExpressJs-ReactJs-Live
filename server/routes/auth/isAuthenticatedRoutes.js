// routes/auth.js
const express = require('express');
const { verifyToken } = require('../../middlewares/authMiddleware'); // Adjust the path as needed
 
const router = express.Router();
 
// Add this route to check authentication
router.get('/isAuthenticated', verifyToken, (req, res) => {
  if (req.user) {
    // User is authenticated
    // res.json({ isAuthenticated: true }); 
    res.json({ isAuthenticated: true, user: req.user });   
  } else {
    // User is not authenticated (guest)
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;
 