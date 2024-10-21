import axios from 'axios';

// Base URL for the API, can be configured via environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/vendor/auth';

// Utility function to get the vendor token from localStorage
const getVendorToken = () => {
  const vendorDataString = localStorage.getItem('vendor');
  if (!vendorDataString) {
    throw new Error('Vendor data not found in local storage.');
  }

  const vendorData = JSON.parse(vendorDataString);
  if (!vendorData.token) {
    throw new Error('No token found in vendor data.');
  }

  return vendorData.token;
};

// Function to get Authorization headers with the vendor token
const getAuthConfig = (additionalConfig = {}) => {
  const token = getVendorToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...additionalConfig,  // Merge any additional configuration (like params, timeout, etc.)
  };
};

// Function to handle API requests with error handling
const handleRequest = async (request) => {
  try {
    const response = await request();
    return response.data; // Return the response data
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'API request failed';
    throw new Error(errorMessage);
  }
};

// Service to fetch vendor data from the API
export const fetchVendorData = async () => {
  return handleRequest(() =>
    axios.get(`${API_URL}/me`, getAuthConfig())
  );
};

// Extract and return vendor ID from fetched data
export const getVendorId = async () => {
  try {
    const vendor = await fetchVendorData();
    return vendor._id; // Assuming the vendor's ID is in the `_id` field
  } catch (error) {
    throw new Error(`Failed to get vendor ID: ${error.message}`);
  }
};

// Example of a function to fetch vendor orders
export const fetchVendorOrders = async () => {
  return handleRequest(() =>
    axios.get(`${API_URL}/orders`, getAuthConfig())
  );
};

// Example of a function to update vendor profile
export const updateVendorProfile = async (profileData) => {
  return handleRequest(() =>
    axios.put(`${API_URL}/update`, profileData, getAuthConfig())
  );
};

// Example of a function to manage vendor's specific request (extendable to other vendor services)
export const fetchVendorSpecificData = async (endpoint, params = {}) => {
  return handleRequest(() =>
    axios.get(`${API_URL}/${endpoint}`, getAuthConfig({ params }))
  );
};
 