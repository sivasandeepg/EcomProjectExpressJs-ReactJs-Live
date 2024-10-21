// src/services/customer/AddressService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/addresses';
 
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
 
// Fetch user's saved addresses
export const getAddresses = async () => {
    try {
        const config = getAuthConfig();
        const response = await axios.get(`${API_BASE_URL}/get`, config); 
        return response.data; // Return the addresses 
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
    }
};
  
// Add a new address
export const addAddress = async (addressData) => {
    try {
        const config = getAuthConfig();
        const response = await axios.post(`${API_BASE_URL}/add`, addressData, config);
        return response.data; // Return the created address
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add address');
    }
};
 