import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthServices from '../services/customer/AuthServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Fetch the user profile when the token exists
      AuthServices.getProfile()
        .then(profile => {
          setUser(profile); // Set user profile if token is valid
        })
        .catch(() => {
          logout(); // Handle invalid token (remove it)
        })
        .finally(() => setLoading(false)); // Stop loading when profile is fetched
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await AuthServices.login(credentials);
      localStorage.setItem('authToken', response.token); // Store token
      setUser(response.user); // Set user immediately after login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Remove token on logout
    setUser(null); // Reset user state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
 