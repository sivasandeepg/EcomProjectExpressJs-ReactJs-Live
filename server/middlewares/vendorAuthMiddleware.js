const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Authorization: Bearer <token>
  
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
 console.log(`twt-token--`+token);
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.vendor = decoded; // Attach vendor data to request object
    next();
  });
};
    