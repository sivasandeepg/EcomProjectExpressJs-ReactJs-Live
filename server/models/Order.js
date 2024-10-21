const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
// Schema for individual items in the order
const orderItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtAddTime: {
    type: Number,
    required: true,    
  }, 
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'returned', 'canceled'],
    default: 'pending',
  },
  trackingInfo: {
    trackingNumber: { type: String },
    carrier: { type: String },
    trackingUrl: { type: String },
  },
  deliveryDate: {
    type: Date, // Estimated delivery date
  }, 
}, { _id: false }); // Prevent creating separate _id for order items

// Main Order Schema
const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'returned', 'canceled'],
      default: 'pending',
    },
    placedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deliveryDate: {
      type: Date, // Estimated delivery date
    },
  },
  { timestamps: true }
);

// Index for better performance during query operations
orderSchema.index({ user: 1, orderStatus: 1 });

// Export the Order model
module.exports = mongoose.model('Order', orderSchema);
  