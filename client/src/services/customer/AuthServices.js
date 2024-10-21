import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update this URL to match your backend

// Utility function to get the JWT token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Utility function to set the JWT token to localStorage
const setToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

// Utility function to remove the JWT token from localStorage
const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Utility function to create authorization header config
const getAuthConfig = () => {
  const token = getToken();
  const config = {
    headers: {}
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// Function to get the profile of the authenticated user
const getProfile = async () => {
  const config = getAuthConfig();

  if (!config.headers.Authorization) {
    throw new Error('No token found. Please log in again.');
  }

  try {
    // Make a GET request to fetch the user's profile data
    const response = await axios.get(`${API_URL}/auth/google/currentuser`, config);
    return response.data; // Return the profile data (user object)
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

// Function to log in the user and store the token
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/google/login`, credentials);
    const { token } = response.data;
    setToken(token); // Store token
    return response.data; // Return user data
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};

// Function to log out the user and remove the token
const logout = () => {
  removeToken(); // Clear the token from localStorage
  localStorage.removeItem('authToken'); 
};

// Function to check if the user is authenticated 
const isAuthenticated = async () => {
  const config = getAuthConfig();
 
  try {
    const response = await axios.get(`${API_URL}/auth/isAuthenticated`, config);  
    return response.data.isAuthenticated; // Return true or false
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false; // Return false in case of error
  }
};

// Export the authentication services
const AuthServices = {
  getProfile,
  login,
  logout,
  isAuthenticated,
};

export default AuthServices;
  