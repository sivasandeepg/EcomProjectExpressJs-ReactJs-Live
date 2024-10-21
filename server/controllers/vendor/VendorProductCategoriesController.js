const Category = require('../../models/Category');
const Subcategory = require('../../models/Subcategory');
const Brand = require('../../models/Brand');
const Model = require('../../models/Model');
const Size = require('../../models/Size');

// Controller logic to handle adding new data
exports.addCategory = async (req, res) => {  
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.status(201).json({ message: 'Category added successfully.', category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addSubcategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const subcategory = new Subcategory({ name, category });
    await subcategory.save();
    res.status(201).json({ message: 'Subcategory added successfully.', subcategory });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 
exports.addBrand = async (req, res) => {
  try {
    const { name, subcategory } = req.body;
    const brand = new Brand({ name, subcategory });
    await brand.save(); 
    res.status(201).json({ message: 'Brand added successfully.', brand });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addModel = async (req, res) => {
  try {
    const { name, brand } = req.body;
    const model = new Model({ name, brand });
    await model.save();
    res.status(201).json({ message: 'Model added successfully.', model });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// / Function to add sizes
exports.addSize = async (req, res) => {
  try {
    const { sizes } = req.body; // Expecting sizes to be an array of size objects

    // Create size documents
    const sizeDocuments = sizes.map(size => ({
      name: size.name,
      model: size.model, // Assuming size has a model property
    }));

    // Save multiple sizes
    const savedSizes = await Size.insertMany(sizeDocuments);

    return res.status(201).json(savedSizes);
  } catch (error) {
    console.error('Failed to save sizes:', error);
    return res.status(500).json({ message: 'Failed to save sizes. Please try again.' });
  }
};  
  
// Controller logic to handle retrieving data
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.find({ category: categoryId }).populate('category', 'name');
    res.status(200).json(subcategories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
  
exports.getBrands = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const brands = await Brand.find({ subcategory: subcategoryId }).populate('subcategory', 'name');
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
  
exports.getModels = async (req, res) => {
  try {
    const { brandId } = req.params;
    const models = await Model.find({ brand: brandId }).populate('brand', 'name');
    res.status(200).json(models);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSizes = async (req, res) => {
  try {
    const { modelId } = req.params;
    const sizes = await Size.find({ model: modelId }).populate('model', 'name');
    res.status(200).json(sizes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 