const cartService = require('../../services/CartService');

// After successful login
exports.login = async (req, res) => {
  try {
    const { user, sessionID } = req;
    const guestCart = await cartService.getCartForSession(sessionID);
    const userCart = await cartService.getCartForUser(user.id);

    if (guestCart.items.length > 0) {
      // Merge guest cart into user cart
      await cartService.mergeCarts(guestCart, userCart);

      // Clear guest cart after merging
      await cartService.clearCart(guestCart);
    }

    res.status(200).json({ message: 'Login successful', cart: userCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 