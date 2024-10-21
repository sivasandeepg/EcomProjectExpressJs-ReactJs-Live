const mongoose = require('mongoose');
const ratingSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the product
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who gave the rating
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating score from 1 to 5
  review: { type: String, maxlength: 1000 }, // Optional text review
  images: [{ type: String }], // Optional review images (URLs)
  helpfulVotes: { type: Number, default: 0 }, // Number of users who found the review helpful
  verifiedPurchase: { type: Boolean, default: false }, // Whether the user purchased the product
  postedAt: { type: Date, default: Date.now }, // Date when the rating was posted
  isFlagged: { type: Boolean, default: false }, // Flagged for inappropriate content
}, { timestamps: true });

// Index to optimize querying for product-specific ratings and sorting by recent or helpful
ratingSchema.index({ product: 1, rating: -1 });
ratingSchema.index({ helpfulVotes: -1 });
ratingSchema.index({ postedAt: -1 });

module.exports = mongoose.model('Rating', ratingSchema);
