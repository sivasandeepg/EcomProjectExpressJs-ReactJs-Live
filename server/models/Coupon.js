const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, // ensures coupon codes are stored in uppercase
    trim: true
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100 // ensuring the discount is between 0% and 100%
  },
  isActive: {
    type: Boolean,
    default: true // set to false if coupon is disabled
  },
  expirationDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number, // the number of times this coupon can be used
    default: 1
  },
  timesUsed: {
    type: Number,
    default: 0 // tracks how many times the coupon has been used
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming a User model exists for admin or vendor creating coupons
    required: true
  }
}, { timestamps: true });

// Method to check if coupon is valid
CouponSchema.methods.isValid = function () {
  return this.isActive && new Date() < this.expirationDate && this.timesUsed < this.usageLimit;
};

module.exports = mongoose.model('Coupon', CouponSchema);
 