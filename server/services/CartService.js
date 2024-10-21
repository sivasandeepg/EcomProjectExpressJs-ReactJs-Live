const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
   

// Add product to cart
exports.addItemToCart = async (cart, productId, vendorId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');
  if (product.stockQuantity < quantity) throw new Error('Not enough stock available');

  const existingItem = cart.items.find(item => item.product.equals(productId));
  
  if (existingItem) {
    // Update the quantity if the item is already in the cart
    existingItem.quantity += quantity; 
  } else {
    // Add the new item to the cart, include `priceAtAddTime`
    cart.items.push({
      product: productId,
      vendor: vendorId,
      quantity,
      priceAtAddTime: product.price, // Include the price at the time of adding
    });
  }
  
  return await cart.save();
};
 

// Get cart for a user
exports.getCartForUser = async (userId) => {
  let cart = await Cart.findOne({ user: userId, status: 'active' }).populate('items.product');
  
  // Create a new cart if it doesn't exist
  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [], // Initialize with an empty items array
      status: 'active',
      totalDiscount: 0
    });
    await cart.save(); // Save the new cart to the database
  }
  
  return cart; // Return the cart (whether found or newly created)
};
 
// Get cart for UUID
exports.getCartForUUID = async (cartUUID) => {
  let cart = await  Cart.findOne({ cartUUID, status: 'active' }).populate('items.product');

   // Create a new cart if it doesn't exist
   if (!cart) {
    cart = new Cart({
      cartUUID: cartUUID, 
      items: [], // Initialize with an empty items array
      status: 'active',
      totalDiscount: 0
    });
    await cart.save(); // Save the new cart to the database
  }
  
  return cart; // Return the cart (whether found or newly created)
};

// Remove product from cart
exports.removeItemFromCart = async (cartUUID, userId, productId) => {
  const cart = userId ? await this.getCartForUser(userId) : await this.getCartForUUID(cartUUID);
  cart.items = cart.items.filter(item => !item.product.equals(productId));
  return await cart.save();
};

// Apply coupon to the cart
exports.applyCouponForCart = async (cartUUID, userId, couponCode) => {
  const cart = userId ? await this.getCartForUser(userId) : await this.getCartForUUID(cartUUID);
  const coupon = await Coupon.findOne({ code: couponCode });
  if (!coupon) throw new Error('Invalid coupon');

  cart.totalDiscount = coupon.discountPercentage;
  return await cart.save();
};

// Clear the cart
exports.clearCartForSessionOrUser = async (cartUUID, userId) => {
  const cart = userId ? await this.getCartForUser(userId) : await this.getCartForUUID(cartUUID);
  cart.items = [];
  return await cart.save();
};

// Update item quantity in the cart
exports.updateItemQuantityForCart = async (cartUUID, userId, productId, quantity) => {
  const cart = userId ? await this.getCartForUser(userId) : await this.getCartForUUID(cartUUID);
  const item = cart.items.find(item => item.product.equals(productId));
  if (item) item.quantity = quantity;
  return await cart.save();
};
 
   
// Merge guest cart with user cart
exports.mergeCarts = async (guestCart, userCart) => {
  const productMap = new Map();

  for (const guestItem of guestCart.items) {
    const userCartItem = userCart.items.find(uItem => uItem.product.equals(guestItem.product));

    let product = productMap.get(guestItem.product.toString());
    if (!product) {
      product = await Product.findById(guestItem.product);
      if (!product) {
        throw new Error(`Product with ID ${guestItem.product} not found`);
      }
      productMap.set(guestItem.product.toString(), product);
    }

    // Log guest and user quantities for debugging
    console.log(`Guest Item Quantity: ${guestItem.quantity}`);
    if (userCartItem) {
      console.log(`User Item Quantity (before merge): ${userCartItem.quantity}`);
      userCartItem.quantity = Math.min(userCartItem.quantity + guestItem.quantity, product.stockQuantity);
      console.log(`User Item Quantity (after merge): ${userCartItem.quantity}`);
    } else {
      console.log(`User does not have this item, adding to cart: Guest Item Quantity: ${guestItem.quantity}`);
      userCart.items.push({
        product: guestItem.product,
        vendor: guestItem.vendor,
        quantity: Math.min(guestItem.quantity, product.stockQuantity),
        priceAtAddTime: guestItem.priceAtAddTime,
      });
    }
  }

  await userCart.save();
  return userCart;
};
