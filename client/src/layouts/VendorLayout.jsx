// src/layouts/AdminLayout.jsx
import React from 'react';
import Sidebar from '../components/vendor/Sidebar';
import '../styles/VendorLayout.css'; 
 
const VendorLayout = ({ children }) => {
  return (
    <div className="vendor-layout" role="main">
      <Sidebar role="navigation" />
      <div className="vendor-layout-content" role="contentinfo">
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};
 
export default VendorLayout;
 