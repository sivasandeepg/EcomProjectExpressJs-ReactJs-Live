const express = require('express');
const router = express.Router();
const VendorProductController = require('../../controllers/vendor/VendorProductController'); 
const { upload, multerErrorHandler } = require('../../middlewares/uploadMiddleware');
const { verifyVendorToken } = require('../../middlewares/vendorAuthMiddleware');

// Define routes
router.get('/', VendorProductController.getProducts);
// router.get('/', verifyVendorToken, VendorProductController.getProducts); 
router.post('/', upload.array('images', 10), multerErrorHandler, VendorProductController.addProduct); // 10 files max
router.put('/:id', upload.array('images', 10), multerErrorHandler, VendorProductController.updateProduct); // 10 files max
router.delete('/:id', VendorProductController.deleteProduct);

module.exports = router; 
  