const Vendor = require('../../models/Vendor');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../utils/jwtHelperforVendor'); 

 
const config = require('../../config/secretkeys'); 
const { body, validationResult } = require('express-validator');

// Validation Middleware using express-validator
exports.validateVendorSignup = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('storeName').not().isEmpty().withMessage('Store name is required'),
  body('businessLicense')
    .not()
    .isEmpty()
    .withMessage('Business license is required'),
  body('displayName').not().isEmpty().withMessage('Display name is required'),
];

exports.vendorSignup = async (req, res) => {
  const { email, password, businessLicense, storeName, displayName, googleId } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if vendor with the same email already exists
    let existingVendor = await Vendor.findOne({ email, role: 'vendor' });
    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new vendor document
    const vendor = new Vendor({
      email,
      password: hashedPassword,
      storeName,
      businessLicense,
      role: 'vendor',
      displayName,
      googleId,
    });

    // Save the vendor in the database
    await vendor.save();

   // Generate JWT token
     const token = generateToken(vendor);
     req.session.vendor = vendor; // Store user in the session

    // Return success response with the token and vendor data
    return res.status(201).json({ token, vendor: { email: vendor.email, displayName: vendor.displayName } });
  } catch (error) {
    console.error('Server error during vendor signup:', error.message);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};



exports.vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the vendor exists
    const vendor = await Vendor.findOne({ email, role: 'vendor' });
    if (!vendor) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = generateToken(vendor);
    req.session.vendor = vendor; // Store user in the session 

    // Return token and vendor data (excluding the password)
    return res.json({ token, vendor: { id: vendor._id, email: vendor.email, displayName: vendor.displayName } });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
};
 

 
// Get Vendor Data after verifying token
exports.getVendorData = async (req, res) => {
  if (!req.vendor) {
    return res.status(401).json({ message: 'Unauthorized, please log in' });
  }
  try {
    // Fetch the vendor's data from the database excluding password
    const vendor = await Vendor.findById(req.vendor.id).select('-password');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    // Return the vendor's essential data
    return res.json({
      id: vendor._id,
      email: vendor.email,
      displayName: vendor.displayName,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
};
 
  
