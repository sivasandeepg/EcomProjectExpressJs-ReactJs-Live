// src/layouts/CustomerLayout.jsx
import React from 'react';
import Navbar from '../components/customer/Navbar';
import '../styles/CustomerLayout.css'; // Optional: for any specific styling you may want for the layout
import Footer from '../components/customer/Footer';
   
const CustomerLayout = ({ children }) => {
  return (
    <>
   <Navbar />
    <div>
      <main>{children}</main>
    </div> 
    <Footer/>
    </>
  );
};
 
export default CustomerLayout;
 