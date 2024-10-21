const Product = require('../../models/Product');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');

// Helper function to delete files asynchronously
const deleteFiles = async (files) => {
  for (const fileUrl of files) {
    const filePath = path.join(__dirname, '../../', fileUrl);
    try {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file: ${filePath}`, error);
    }
  }
};

// Create product with images
// const addProduct = asyncHandler(async (req, res) => {
//   const imageUrls = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
//   const newProductData = { ...req.body, imageUrls };

//   try {
//     const newProduct = await Product.create(newProductData);
//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({ message: 'Error creating product', error });
//   }
// });
 
// Create product with images
const addProduct = asyncHandler(async (req, res) => {
  const imageUrls = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
  const newProductData = { ...req.body, imageUrls };

  try {
    const newProduct = await Product.create(newProductData);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);

    // Handle duplicate SKU error
    if (error.code === 11000 && error.keyPattern && error.keyPattern['variants.sku']) {
      res.status(400).json({ message: 'A variant with this SKU already exists' });
    } else if (error.code === 11000 && error.keyPattern && error.keyPattern.sku) {
      res.status(400).json({ message: 'A product with this SKU already exists' });
    } else {
      res.status(500).json({ message: 'Error creating product', error });
    }
  }
});
 


// Update product with new images
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete old images if new images are uploaded
    if (req.files && req.files.length > 0) {
      await deleteFiles(product.imageUrls);
      product.imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Update product details
    const { imageUrls, ...updatedData } = req.body; // Prevent overwriting imageUrls
    Object.assign(product, updatedData);
    
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete product and its images
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await deleteFiles(product.imageUrls);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Get all products with pagination  
const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (page - 1) * limit;

  try {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const products = await Product.find(query).skip(skip).limit(Number(limit)).select('-__v');
    const totalCount = await Product.countDocuments(query);

    res.status(200).json({
      products,
      totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

module.exports = { addProduct, updateProduct, deleteProduct, getProducts };
  