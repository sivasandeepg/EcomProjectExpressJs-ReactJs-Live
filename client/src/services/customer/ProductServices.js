//Src>services>customer>api>ProductServices.js 
import axios from 'axios';
const EXPRESS_BASE_URL = 'https://ecomproject-expressjs-live.onrender.com';       
// const EXPRESS_BASE_URL = process.env.API_BASE_URL||process.env.LOCAL_API_BASE_URL;  
const API_BASE_URL = `${EXPRESS_BASE_URL}/api` ; 

// Get all products 
export const getProducts = async (page = 1, limit = 6) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};



// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


 
// Search products with filters  
export const getSearchResults = async (query, filters = {}, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/search`, {
      params: { query, ...filters, page, limit } // Pass filters and pagination as params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
     

