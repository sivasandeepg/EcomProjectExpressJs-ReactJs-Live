const express = require('express');
const router = express.Router(); 
const { getProducts, getProductById, searchProducts } = require('../../controllers/customer/ProductController');

// Search products with advanced filters
router.get('/search', searchProducts);  

// Get all products with pagination and optional search
router.get('/', getProducts);

// Get a single product by its ID
router.get('/:id', getProductById);


 

module.exports = router;
 