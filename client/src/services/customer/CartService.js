import axios from 'axios';

// Ensure that cookies are sent with all requests globally
axios.defaults.withCredentials = true;
// const EXPRESS_BASE_URL = process.env.API_BASE_URL||process.env.LOCAL_API_BASE_URL; 
const EXPRESS_BASE_URL = 'https://ecomproject-expressjs-live.onrender.com';    
const API_BASE_URL =  `${EXPRESS_BASE_URL}/api/cart` ;

// Utility function to get the authorization config
const getAuthConfig = () => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
  const config = {
    headers: {},
    withCredentials: true // Include cookies with every request
  };

  if (token) {
    // Include token if available (for authenticated users)
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // Return the config with or without Authorization header
};

// Utility function to ensure a cartUUID exists
const ensureCartUUID = async () => {
  let cartUUID = localStorage.getItem('cartUUID');
  
  if (!cartUUID) {
    try {
      const response = await axios.post(`${API_BASE_URL}/cart`); // Create a new cart on the backend only if no UUID exists
      cartUUID = response.data.cartUUID; // Get the cartUUID from backend's response
      localStorage.setItem('cartUUID', cartUUID); // Save cartUUID in localStorage for future use
    } catch (error) {
      console.error('Error creating a new cart:', error.response?.data?.message || error.message);
      throw new Error('Unable to create a new cart. Please try again.');
    }
  }

  return cartUUID; // Return the cartUUID
};
  
   
  
// Add product to cart
export const addToCart = async (productId, vendorId, quantity) => {
  try {
    const cartUUID = await ensureCartUUID(); // Ensure cartUUID exists    
    console.log(`id--`+productId+`....vid---`+vendorId+`...qtv--`+quantity+ `...uid---`+cartUUID )
    const config = getAuthConfig(); // Handle authentication
    const response = await axios.post(
      `${API_BASE_URL}/add`, 
      { productId, vendorId, quantity, cartUUID }, // Include cartUUID
      config
    );
    return response.data; // Return the updated cart
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add product to cart');
  }
};
       
// Get current cart
export const getCart = async () => {
  try {
    const cartUUID = await ensureCartUUID(); // Ensure cartUUID exists
    const config = getAuthConfig(); // Handle authentication
    const response = await axios.get(`${API_BASE_URL}/get`, {
      ...config,
      params: { cartUUID }, // Pass cartUUID to identify the correct cart
    });
    return response.data; // Return the current cart
  } catch (error) {
    console.error('Error fetching the cart:', error.response?.data?.message || error.message);
    throw new Error('Failed to fetch the cart. Please try again later.');
  }
};
   
export const getGustCart = async () => {
  try {
    // const cartUUID = localStorage.getItem('cartUUID');    
    const cartUUID = await ensureCartUUID(); // Ensure cartUUID exists 
    const response = await axios.get(`${API_BASE_URL}/getgust`, {
      params: { cartUUID }, // Pass cartUUID as query param
    });
    return response.data; // Return the current cart
  } catch (error) {
    console.error('Error fetching the cart:', error.response?.data?.message || error.message);
    throw new Error('Failed to fetch the cart. Please try again later.');
  }
};  
 
// Remove product from cart
export const removeFromCart = async (productId) => {
  try {
    const cartUUID = await ensureCartUUID(); // Ensure cartUUID exists
    const config = getAuthConfig(); // Handle authentication
    const response = await axios.post(
      `${API_BASE_URL}/remove`, 
      { productId, cartUUID }, // Include cartUUID in the request
      config
    );
    return response.data; // Return the updated cart
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove product from cart');
  }
};

// Apply a coupon to the cart
export const applyCoupon = async (couponCode) => {
  try {
    const cartUUID = await ensureCartUUID(); // Ensure cartUUID exists
    const config = getAuthConfig(); // Handle authentication
    const response = await axios.post(
      `${API_BASE_URL}/apply-coupon`, 
      { couponCode, cartUUID }, // Include cartUUID
      config
    );
    return response.data; // Return the updated cart with the coupon applied
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to apply coupon');
  }
};


// Clear the cart
export const clearCart = async () => {
  try {
    const cartUUID = await ensureCartUUID(); // Ensure cartUUID exists
    const config = getAuthConfig(); // Handle authentication
    const response = await axios.post(
      `${API_BASE_URL}/clear`, 
      { cartUUID }, // Include cartUUID
      config
    );
    return response.data; // Return success message
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to clear cart');
  }
};

// Update quantity of an item in the cart
export const updateCartItemQuantity = async (productId, quantity) => {
  try {
    const cartUUID = await ensureCartUUID(); // Ensure cartUUID exists
    const config = getAuthConfig(); // Handle authentication
    const response = await axios.post(
      `${API_BASE_URL}/update-quantity`, 
      { productId, quantity, cartUUID }, // Include cartUUID
      config
    );
    return response.data; // Return the updated cart
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update item quantity');
  }
};
 
// Merge guest cart with user cart 
export const mergeGuestCartWithUserCart = async () => {
  try {
    const cartUUID = await ensureCartUUID(); // Ensure cartUUID exists 
    const config = getAuthConfig(); // Handle authentication
    const response = await axios.post(
      `${API_BASE_URL}/merge`, 
      {cartUUID }, // Include cartUUID
      config
    );
    return response.data; // Return merged cart data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to merge carts');
  }
};

 