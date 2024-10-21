// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../../controllers/customer/addressController');
const { verifyToken } = require('../../middlewares/authMiddleware');
 
// Create a new address
router.post('/add',verifyToken, addressController.createAddress);
 
// Get all addresses for a specific user
// router.get('/get/:userId', addressController.getAddresses);
router.get('/get', verifyToken, addressController.getAddresses);

// Get a specific address by ID
router.get('/address/:id', addressController.getAddressById);

// Update an address by ID
router.put('/update/:id', addressController.updateAddress);

// Delete an address by ID
router.delete('/delete/:id', addressController.deleteAddress); 

module.exports = router;
