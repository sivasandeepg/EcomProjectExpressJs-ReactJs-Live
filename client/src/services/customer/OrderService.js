import axios from 'axios';
// const EXPRESS_BASE_URL = process.env.API_BASE_URL||process.env.LOCAL_API_BASE_URL; 
const EXPRESS_BASE_URL = 'https://ecomproject-expressjs-live.onrender.com';     
const API_BASE_URL = `${EXPRESS_BASE_URL}/api/orders`;
  
// Utility function to get the authorization config
const getAuthConfig = () => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    if (!token) throw new Error('No authentication token found'); // Handle the case where no token is present
    return {
        headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
    };
};

// Create a new order after successful payment
export const createOrder = async (orderData) => {
    try {
        const config = getAuthConfig(); // Get authentication config
        const response = await axios.post(`${API_BASE_URL}/create`, orderData, config); // API call to create the order
        return response.data; // Return the created order data
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create the order'); // Handle any errors
    }
};
 

// Get a specific order by ID
export const getOrderById = async (orderId) => {
    try {
        const config = getAuthConfig();
        const response = await axios.get(`${API_BASE_URL}/${orderId}`, config);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
};
 

 
 
export const getUserOrders = async () => {
    try {
      const config  = getAuthConfig(); // Retrieves token from localStorage
      const response = await axios.get(`${API_BASE_URL}/my-orders`, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  };
  