  // middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer
  const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have your secret in .env

  if (!token) {
    // No token, proceed as guest
    req.user = null; // Set user as null for guest users
    return next();
    // return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded; // Set user information from token
    next();
  });
};
  