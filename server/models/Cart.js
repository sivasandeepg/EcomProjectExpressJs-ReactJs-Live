const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
 
const cartItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: async function (quantity) {
        const product = await mongoose.model('Product').findById(this.product);
        return product.stockQuantity >= quantity;
      },
      message: 'Not enough stock available for this product'
    }
  },
  priceAtAddTime: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Optional for guest carts
  },
  cartUUID: { 
    type: String, 
    // default: uuidv4,  // Generate UUID when the cart is created
    unique: true 
  },
  sessionId: { type: String, required: false },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDiscount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // couponCode: {
  //   type: String,
  //   default: '',
  //   validate: {
  //     validator: async function (code) {
  //       const coupon = await mongoose.model('Coupon').findOne({ code });
  //       return coupon && coupon.isValid();  // Check if the coupon is valid
  //     },
  //     message: 'Invalid coupon code'
  //   }
  // }, 
    couponCode: {
    type: String, 
    ref: 'Vendor',
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'completed', 'canceled'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    index: { expires: '7d' }  // Expire after 7 days
  }
}, { timestamps: true });

cartSchema.pre('save', async function (next) { 

  if (!this.cartUUID) {
    this.cartUUID = uuidv4();
  } 
  let total = 0;
  let discount = 0;

  for (const item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    total += item.priceAtAddTime * item.quantity;
    discount += (item.priceAtAddTime * item.quantity * item.discount) / 100;
  }

  this.totalPrice = total;
  this.totalDiscount = discount;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
 