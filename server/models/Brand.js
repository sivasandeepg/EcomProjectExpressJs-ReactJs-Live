const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subcategory: {  // Changed from 'category' to 'subcategory'
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory' // Reference to the Subcategory model
  }
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
  