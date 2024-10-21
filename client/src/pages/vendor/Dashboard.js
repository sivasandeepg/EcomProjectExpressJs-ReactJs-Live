import React, { useEffect, useState } from 'react';
import '../../styles/Dashboard.css';

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Retrieve vendor data from localStorage
      const vendorData = JSON.parse(localStorage.getItem('vendor'));

      // Check if vendor data exists
      if (!vendorData) {
        setError('You need to log in.');
        return;
      }

      setVendor(vendorData);
    } catch (err) {
      setError('Invalid vendor data found.');
    }
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="vendor-dashboard">
      <h1>Vendor Dashboard</h1>
      {vendor ? (
        <div>
          <h2>Welcome, {vendor.displayName}</h2>
          <p>Email: {vendor.email}</p>
          {/* Display additional vendor data as needed */}
        </div>
      ) : (
        <p>Loading vendor data...</p>
      )}
    </div>
  );
};

export default VendorDashboard;
