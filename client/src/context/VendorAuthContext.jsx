import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginVendor, getVendorData } from '../services/vendor/AuthServices';

const VendorAuthContext = createContext();

export const VendorAuthProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load vendor if token exists
  useEffect(() => {
    const token = localStorage.getItem('vendorToken');
    if (token) {
      getVendorData()
        .then(setVendor)
        .catch(logout)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await loginVendor(email, password);
      const vendorData = {
        id: data.vendor.id,
        email: data.vendor.email,
        displayName: data.vendor.displayName,
      };
      localStorage.setItem('vendorToken', data.token);
      localStorage.setItem('vendor', JSON.stringify(vendorData));
      setVendor(vendorData);
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('vendorToken');
    setVendor(null);
    navigate('/vendor/login');
  };

  return (
    <VendorAuthContext.Provider value={{ vendor, login, logout, loading, error }}>
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useAuth = () => useContext(VendorAuthContext);
 