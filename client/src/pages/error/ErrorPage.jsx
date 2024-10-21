// src/pages/error/ErrorPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const location = useLocation();
  const error = location.state?.error || 'An unknown error occurred.';

  return (
    <div>
      <h1>Error</h1>
      <p>{error}</p>
    </div>
  );
};

export default ErrorPage;
