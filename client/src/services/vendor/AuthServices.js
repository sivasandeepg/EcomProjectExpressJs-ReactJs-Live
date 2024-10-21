import axios from 'axios';
 
const API_URL = 'http://localhost:5000/api/vendor/auth';

const getToken = () => localStorage.getItem('vendorToken');
  
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const loginVendor = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      return response.data;
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const getVendorData = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Fetching vendor data failed');
  }
};
 
   
// Vendor signup function
export const signupVendor = async (vendorData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, vendorData); // Adjust API endpoint as needed
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed.');
  }
};
   