const Product = require('../../models/Product');
const Cart = require('../../models/Cart'); 
const cartService = require('../../services/CartService');
const { v4: uuidv4 } = require('uuid');
 
 
// Create or return guest cart
exports.createGuestCart = async (req, res) => {
  try {
    let { cartUUID } = req.body;

    // If the cartUUID exists in the request, check if a cart with that UUID exists
    if (cartUUID) {
      const existingCart = await Cart.findOne({ cartUUID });
      if (existingCart) {
        return res.status(200).json(existingCart); // Return the existing cart if found
      }
    }
    
    // If no cartUUID exists, or if the cartUUID does not match any existing cart, create a new one
    const newCartUUID = uuidv4(); // Generate a new cartUUID
    const newCart = new Cart({ cartUUID: newCartUUID, items: [] }); // Create a new empty cart
    await newCart.save(); // Save the cart to the database

    res.status(201).json({ cartUUID: newCartUUID }); // Return the new cartUUID to the client
  } catch (err) {
    console.error('Error creating guest cart:', err.message);
    res.status(500).json({ message: 'Failed to create guest cart' });
  }
};
  
 


// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, vendorId, quantity, cartUUID } = req.body;
    const isLoggedIn = req.user && req.user.id;

    let cart = isLoggedIn
      ? await cartService.getCartForUser(req.user.id)
      : await cartService.getCartForUUID(cartUUID);

    cart = await cartService.addItemToCart(cart, productId, vendorId, quantity);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// Get current cart
exports.getCart = async (req, res) => {
  try {
    const { cartUUID } = req.query; 
    // const { cartUUID } = req.body;     
    console.log(`cart uuid`+cartUUID);
    const isLoggedIn = req.user && req.user.id;

    const cart = isLoggedIn
      ? await cartService.getCartForUser(req.user.id)
      : await cartService.getCartForUUID(cartUUID);

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

    
   
exports.getGustCart = async (req, res) => {
  const { cartUUID } = req.query;  
  // const { cartUUID } = req.body; 
  console.log('Fetching cart with UUID:', cartUUID);  // Log the UUID on the server side
  const cart = await cartService.getCartForUUID(cartUUID);
  if (!cart) {
    console.log('Cart not found for UUID:', cartUUID);  // Log if the cart is not found
  }
  res.status(200).json(cart);
};
  

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId, cartUUID } = req.body;
    const isLoggedIn = req.user && req.user.id;

    await cartService.removeItemFromCart(cartUUID, isLoggedIn ? req.user.id : null, productId);
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Apply coupon
exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode, cartUUID } = req.body;
    const isLoggedIn = req.user && req.user.id;

    const updatedCart = await cartService.applyCouponForCart(cartUUID, isLoggedIn ? req.user.id : null, couponCode);
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear the cart
exports.clearCart = async (req, res) => {
  try {
    const { cartUUID } = req.body;
    const isLoggedIn = req.user && req.user.id;

    await cartService.clearCartForSessionOrUser(cartUUID, isLoggedIn ? req.user.id : null);
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update item quantity
exports.updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity, cartUUID } = req.body;
    const isLoggedIn = req.user && req.user.id;

    const updatedCart = await cartService.updateItemQuantityForCart(cartUUID, isLoggedIn ? req.user.id : null, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  
// Merge guest cart into user cart after login
exports.mergeCart = async (req, res) => {
  try {
    const { cartUUID } = req.body;
    const isLoggedIn = req.user && req.user.id;
   
  
    // Fetch guest and user carts
    const guestCart = await cartService.getCartForUUID(cartUUID);
    const userCart = await cartService.getCartForUser(req.user.id);

    // If guest cart has items, merge them
    if (guestCart && guestCart.items.length > 0) {
      const mergedCart = await cartService.mergeCarts(guestCart, userCart);
      // Optionally delete the guest cart after merging
      await Cart.deleteOne({ cartUUID });
      res.status(200).json(mergedCart);
    } else {
      // If guest cart is empty, return the user cart
      res.status(200).json(userCart);
    }
  } catch (err) {
    console.error('Error merging carts:', err.message);
    res.status(500).json({ message: err.message });
  }
};
 
 
