// server/utils/jwtHelper.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/secretkeys'); 

// Function to generate a JWT token
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '1h' } // Set token expiration time
  );
};
  
// Function to verify a JWT token
exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
 