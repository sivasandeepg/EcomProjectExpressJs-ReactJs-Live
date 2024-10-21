const mongoose = require('mongoose');

// Assuming `variantSchema` is defined elsewhere
// Variant schema definition
const variantSchema = new mongoose.Schema({
  color: { type: String, required: true }, // Color of the variant
  size: { type: String, required: true },  // Size or other distinguishing feature
  price: { type: Number, required: true, min: 0 }, // Price of the variant
  // sku: { type: String, unique: false, required: false }, // SKU for the variant
  stockQuantity: { type: Number, default: 0, min: 0 } // Stock quantity of the variant
}); 
      
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  // brand: { type: String, required: true, maxlength: 255 },    
   brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },    
  model: { type: String, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, maxlength: 10000 }, 
  imageUrls: [{ type: String }],
  stockQuantity: { type: Number, required: true, default: 0, min: 0 },
  sku: { type: String, unique: false },      
  productFeatures: [{ type: String }],
  discount: { type: Number, default: 0, min: 0, max: 100 },
  availability: { type: Boolean, default: true },
  isNewArrival: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  color: { type: String, default: '' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  variants: [variantSchema], // Product variants
  isActive: { type: Boolean, default: true },
  seoMeta: {
    metaTitle: { type: String, maxlength: 255 },
    metaDescription: { type: String, maxlength: 500 },
    tags: [{ type: String }]
  },
  lowStockAlert: { type: Boolean, default: false },
  restockDate: { type: Date },
}, { timestamps: true });

// Indexes for optimized querying
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });

module.exports = mongoose.model('Product', productSchema);
 