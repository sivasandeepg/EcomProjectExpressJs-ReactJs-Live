const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Subcategory = require('../../models/Subcategory');
const Brand = require('../../models/Brand');
const Model = require('../../models/Model');
const Vendor = require('../../models/Vendor'); 
const User = require('../../models/User');

// Search products with advanced filters
exports.searchProducts = asyncHandler(async (req, res) => {
  try {
    const { query, brand, model, minPrice, maxPrice, color, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    // Create a filter object
    const filters = {};

    // Function to handle regex search
    const buildRegexQuery = (field, value) => {
      return { [field]: { $regex: value, $options: 'i' } };
    };

    // Category and subcategory searches
    if (query) {
      const [categoryRecord, subcategoryRecord, brandRecord, modelRecord] = await Promise.all([
        Category.findOne(buildRegexQuery('name', query)),
        Subcategory.findOne(buildRegexQuery('name', query)),
        Brand.findOne(buildRegexQuery('name', query)),
        Model.findOne(buildRegexQuery('name', query)),
      ]);

      if (categoryRecord) {
        filters.category = categoryRecord._id;
      } else if (subcategoryRecord) {
        filters.subcategory = subcategoryRecord._id;
      } else if (brandRecord) {
        filters.brand = brandRecord._id;
      } else if (modelRecord) {
        filters.model = modelRecord._id;
      } else {
        filters.name = { $regex: query, $options: 'i' };
      }
    }

    // Filter by brand
    if (brand) {
      const brandRecord = await Brand.findOne(buildRegexQuery('name', brand));
      if (brandRecord) filters.brand = brandRecord._id;
    }

    // Filter by model
    if (model) {
      const modelRecord = await Model.findOne(buildRegexQuery('name', model));
      if (modelRecord) filters.model = modelRecord._id;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    // Filter by color
    if (color) {
      filters.color = { $regex: color, $options: 'i' };
    }

    // Pagination and Sorting
    const skip = (page - 1) * limit;
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Search for products with filters
    const products = await Product.find(filters)
      .populate('category subcategory brand model')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOptions);

    // Return the products as the result
    res.status(200).json({ 
      products, 
      currentPage: page, 
      totalPages: Math.ceil(await Product.countDocuments(filters) / limit) 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching for products' });
  }
});
  

      

exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;

  // Fetch random products with pagination
  const products = await Product.aggregate([
    { $sample: { size: Number(limit) } } // Randomly selects the number of documents defined by limit
  ]);

  const baseUrl = `${req.protocol}://${req.get('host')}`; // Base URL for images
  const productsWithFullImageUrls = products.map(product => ({
    ...product,
    imageUrls: product.imageUrls.map(imageUrl => `${baseUrl}${imageUrl}`)
  }));

  const totalCount = await Product.countDocuments();

  res.status(200).json({
    products: productsWithFullImageUrls,
    totalCount,
    currentPage: Number(page),
    totalPages: Math.ceil(totalCount / limit),
  });
});


 

// Get a product by its ID
// exports.getProductById = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id).select('-__v');
  
//   if (!product) {
//     res.status(404);
//     throw new Error('Product not found');
//   }

//   const baseUrl = `${req.protocol}://${req.get('host')}`;
//   const productWithFullImageUrls = {
//     ...product.toObject(),
//     imageUrls: product.imageUrls.map(imageUrl => `${baseUrl}${imageUrl}`)
//   };

//   res.status(200).json(productWithFullImageUrls);
// });

exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'vendor',         // Populate vendor field
      model: 'User',          // Specify 'User' model because Vendor is a discriminator of User
      select: 'storeName email'  // Select relevant fields from the Vendor (e.g., storeName, email)
    }) 
    .populate('subcategory', 'name')  // Populate subcategory field
    .populate('brand', 'name')  // Populate brand field 
    .populate('model', 'name')  // Populate model field
    .select('-__v');            // Exclude version key

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const productWithFullImageUrls = {
    ...product.toObject(),
    imageUrls: product.imageUrls.map(imageUrl => `${baseUrl}${imageUrl}`)
  };

  res.status(200).json(productWithFullImageUrls);
});
   