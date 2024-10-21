const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/customer/CartController');
const { verifyToken } = require('../../middlewares/authMiddleware');

// Ensure cartUUID is provided for guest or authenticated users   
router.post('/cart', CartController.createGuestCart); // Create cart if no cartUUID exists  
router.post('/add', verifyToken, CartController.addToCart); // Add product to cart
router.get('/get', verifyToken, CartController.getCart); // Get the current cart
router.get('/getgust',  CartController.getGustCart); // Get the gust cart  
router.post('/remove', verifyToken, CartController.removeFromCart); // Remove product from cart
router.post('/apply-coupon', verifyToken, CartController.applyCoupon); // Apply coupon
router.post('/clear', verifyToken, CartController.clearCart); // Clear the cart
router.post('/update-quantity', verifyToken, CartController.updateItemQuantity); // Update item quantity
router.post('/merge', verifyToken, CartController.mergeCart); // Merge guest cart with user cart

module.exports = router;
