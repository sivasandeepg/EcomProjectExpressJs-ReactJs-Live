// /routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent } =  require('../../controllers/customer/PaymentController');
 

// Route to create a payment intent
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
 