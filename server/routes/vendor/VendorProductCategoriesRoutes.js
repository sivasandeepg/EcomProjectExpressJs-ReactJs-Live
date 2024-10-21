const express = require('express');
const router = express.Router();
const VendorProductCategoriesController = require('../../controllers/vendor/VendorProductCategoriesController');

// POST Routes for adding categories, subcategories, brands, models, sizes
router.post('/addcategories', VendorProductCategoriesController.addCategory);
router.post('/addsubcategories', VendorProductCategoriesController.addSubcategory);
router.post('/addbrands', VendorProductCategoriesController.addBrand);
router.post('/addmodels', VendorProductCategoriesController.addModel);
router.post('/addsizes', VendorProductCategoriesController.addSize);
 
// GET Routes for fetching categories, subcategories, brands, models, sizes
router.get('/getcategories', VendorProductCategoriesController.getCategories);
router.get('/getsubcategories/:categoryId', VendorProductCategoriesController.getSubcategories);
router.get('/getbrands/:subcategoryId', VendorProductCategoriesController.getBrands);

router.get('/getmodels/:brandId', VendorProductCategoriesController.getModels);
router.get('/getsizes/:modelId', VendorProductCategoriesController.getSizes);
module.exports = router;
 