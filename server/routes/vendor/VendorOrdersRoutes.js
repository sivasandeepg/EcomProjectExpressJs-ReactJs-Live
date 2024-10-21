const express = require('express');
const router = express.Router();
const { getVendorOrders, updateOrderStatus, getVendorOrderById } = require('../../controllers/vendor/VendorOrdersController');
const { verifyToken } = require('../../middlewares/vendorAuthMiddleware');

// Protected  routes
router.get('/get',verifyToken, getVendorOrders);  // Only authenticated vendors can access this
router.patch('/:orderId/status',verifyToken, updateOrderStatus); // Protected route
router.get('/order/:orderId', verifyToken, getVendorOrderById); // Protected route
 
module.exports = router;
       