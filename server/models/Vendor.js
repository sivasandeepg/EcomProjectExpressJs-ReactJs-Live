// models/Vendor.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User'); // Import base User model

const vendorSchema = new Schema({
  storeName: { 
    type: String, 
    required: true,
    unique: true,
    index: true 
  },
  products: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Product' 
  }], 
  revenue: { 
    type: Number, 
    default: 0 
  },
  businessLicense: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  password: { 
    type: String, 
    required: true 
  }, // Include password field for vendor authentication
}, { timestamps: true });

const Vendor = User.discriminator('vendor', vendorSchema);
module.exports = Vendor;

