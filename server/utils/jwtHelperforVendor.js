// server/utils/jwtHelper.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/secretkeys'); 
  
/**
 * Generate a JWT token for a vendor.
 * @param {Object} vendor - Vendor object containing vendor details.
 * @returns {String} - JWT token.
 */
exports.generateToken = (vendor) => {
  // Define the payload with vendor details
  const payload = {
    id: vendor.id,         // Vendor's ID
    email: vendor.email,   // Vendor's Email
    role: vendor.role      // Add any other claims like 'role' if required
  };

  // Sign the token with the secret and expiration time
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verify a JWT token.
 * @param {String} token - JWT token to verify.
 * @returns {Object} - Decoded token if valid, throws an error otherwise.
 */
exports.verifyToken = (token) => {
  try {
    // Verify the token using the JWT_SECRET
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
 