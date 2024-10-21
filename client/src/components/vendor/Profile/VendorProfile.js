import { useState, useEffect } from 'react';
import { fetchVendorData } from '../../../services/vendor/VendorDataService.js'; // Import service

const VendorProfile = () => {
  const vendorData = JSON.parse(localStorage.getItem('vendor'));
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        // Call the service to fetch vendor data
        const vendorDetails = await fetchVendorData(vendorData.token);
        
        // Set vendor information
        setVendor({
          displayName: vendorData.displayName,
          email: vendorData.email,
          additionalInfo: vendorDetails, // Additional data from API
        });
      } catch (err) {
        setError('Failed to fetch vendor data: ' + err.message);
      }
    };

    if (vendorData && vendorData.token) {
      loadVendorData(); // Fetch data only if the token exists
    }
  }, [vendorData]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      {vendor ? (
        <div>
          <h1>{vendor.displayName}</h1>
          <p>{vendor.email}</p>
          {/* Render additional vendor data */}
          <p>Additional Info: {JSON.stringify(vendor.additionalInfo)}</p>
        </div>
      ) : (
        <p>Loading vendor data...</p>
      )}
    </div>
  );
};

export default VendorProfile;
