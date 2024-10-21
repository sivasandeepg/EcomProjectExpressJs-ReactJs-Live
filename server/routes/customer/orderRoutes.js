const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, updateOrderStatus } = require('../../controllers/customer/OrderController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const { isAdmin  } = require('../../middlewares/vendorAuthMiddleware');

// Create a new order (after successful payment)
router.post('/create', verifyToken, createOrder); 

// Get all orders of the logged-in user
router.get('/my-orders', verifyToken, getUserOrders);

// Get a specific order by ID
router.get('/:id', verifyToken, getOrderById);

// Update order status (e.g., processing, shipped, delivered, etc.)
router.put('/:id/status', verifyToken, updateOrderStatus);  
// router.put('/:id/status', verifyToken, isAdmin , updateOrderStatus);
 
module.exports = router;
 