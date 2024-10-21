import axios from 'axios';

// Base URLs for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/admin/products';
const API_URL_FOR_CATEGORIES = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/admin/ProductCategories';

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

// Utility function to create a full API URL
const createApiUrl = (baseUrl, endpoint) => `${baseUrl}${endpoint}`;

// Products
export const getProducts = async (page = 1, searchQuery = '') => {
  const endpoint = `?page=${page}&search=${searchQuery}`;
  return handleRequest(() => axios.get(createApiUrl(API_URL, endpoint)));
};

export const addProduct = async (productData) => {
  return handleRequest(() => axios.post(API_URL, productData));
};

export const updateProduct = async (id, updatedData) => {
  return handleRequest(() => axios.put(createApiUrl(API_URL, `/${id}`), updatedData));
};

export const deleteProduct = async (id) => {
  return handleRequest(() => axios.delete(createApiUrl(API_URL, `/${id}`)));
};

// Categories
export const getCategories = async () => {
  return handleRequest(() => axios.get(createApiUrl(API_URL_FOR_CATEGORIES, '/getcategories')));
};

export const addCategory = async (categoryData) => {
  return handleRequest(() => axios.post(createApiUrl(API_URL_FOR_CATEGORIES, '/addcategories'), categoryData));
};

// Subcategories
export const getSubcategories = async (categoryId) => {
  return handleRequest(() => axios.get(createApiUrl(API_URL_FOR_CATEGORIES, `/getsubcategories/${categoryId}`)));
};

export const addSubcategory = async (subcategoryData) => {
  return handleRequest(() => axios.post(createApiUrl(API_URL_FOR_CATEGORIES, '/addsubcategories'), subcategoryData));
};

// Brands
export const getBrands = async (subcategoryId) => {
  return handleRequest(() => axios.get(createApiUrl(API_URL_FOR_CATEGORIES, `/getbrands/${subcategoryId}`)));
};

export const addBrand = async (brandData) => {
  return handleRequest(() => axios.post(createApiUrl(API_URL_FOR_CATEGORIES, '/addbrands'), brandData));
};

// Models
export const getModels = async (brandId) => {
  return handleRequest(() => axios.get(createApiUrl(API_URL_FOR_CATEGORIES, `/getmodels/${brandId}`)));
};

export const addModel = async (modelData) => {
  return handleRequest(() => axios.post(createApiUrl(API_URL_FOR_CATEGORIES, '/addmodels'), modelData));
};

// Sizes
export const getSizes = async (modelId) => {
  return handleRequest(() => axios.get(createApiUrl(API_URL_FOR_CATEGORIES, `/getsizes/${modelId}`)));
};

export const addSize = async (sizeData) => {
  return handleRequest(() => axios.post(createApiUrl(API_URL_FOR_CATEGORIES, '/addsizes'), sizeData));
};

// Exporting the product service object
export const productService = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  getSubcategories,
  addSubcategory,
  getBrands,
  addBrand,
  getModels,
  addModel,
  getSizes,
  addSize,
};
 