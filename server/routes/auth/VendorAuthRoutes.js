const express = require('express');
const router = express.Router();
const { vendorSignup, vendorLogin, getVendorData } = require('../../controllers/auth/VendorAuthController');
const { verifyToken } = require('../../middlewares/vendorAuthMiddleware'); 

// Vendor signup route
router.post('/signup', vendorSignup);

// Vendor login route
router.post('/login', vendorLogin);

// Protected route to get vendor's own data
router.get('/me', verifyToken, getVendorData); // Token verification middleware applied here
  
module.exports = router;
 