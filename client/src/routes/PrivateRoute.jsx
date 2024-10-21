import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth(); // Get loading state from context

  // If still loading, return null or a loading spinner
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loader
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return element; // If authenticated, return the element
};

export default PrivateRoute;
 