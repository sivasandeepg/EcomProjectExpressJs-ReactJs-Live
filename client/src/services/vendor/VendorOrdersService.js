import axios from 'axios';

// Base URL for the vendor orders API
// const EXPRESS_BASE_URL = process.env.API_BASE_URL||process.env.LOCAL_API_BASE_URL; 
const EXPRESS_BASE_URL = 'https://ecomproject-expressjs-live.onrender.com';     
const API_URL = `${EXPRESS_BASE_URL}/api/vendor/vendorOrders` ;
  
// Utility function to get the vendor token from local storage
const getVendorToken = () => {
  const token = localStorage.getItem('vendorToken');
  if (!token) {
    throw new Error('Vendor token not found in local storage.');
  }
  return token;
};

// Function to get Authorization headers
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getVendorToken()}`,
    'Content-Type': 'application/json',
  },
});

// Function to handle API requests with error handling
const handleRequest = async (request) => {
  try {
    const response = await request();
    return response.data; // Return the response data
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred while processing the request';
    console.error('API request error:', errorMessage);
    throw new Error(errorMessage);
  }
};
 
// Fetch all orders for the vendor
export const fetchVendorOrders = async () => {
  return handleRequest(() => axios.get(`${API_URL}/get`, getAuthConfig()));
};

// Update the order status
export const updateOrderStatus = async (orderId, newStatus) => {
  return handleRequest(() =>
    axios.patch(`${API_URL}/${orderId}/status`, { orderStatus: newStatus }, getAuthConfig())
  );
};
  
// Get a specific order by ID
export const fetchVendorOrderById = async (orderId) => {
  return handleRequest(() => axios.get(`${API_URL}/get/${orderId}`, getAuthConfig()));
};

// Additional utility function to handle order-related requests generically
export const handleVendorOrderRequest = async (method, endpoint, data = {}) => {
  return handleRequest(() => axios({ method, url: `${API_URL}/${endpoint}`, data, ...getAuthConfig() }));
};

// Example of a generic function to create a new order (if applicable)
export const createVendorOrder = async (orderData) => {
  return handleVendorOrderRequest('post', 'create', orderData);
};

// Example of a generic function to delete an order
export const deleteVendorOrder = async (orderId) => {
  return handleVendorOrderRequest('delete', `delete/${orderId}`);
};
 