// src/components/shared/Footer.jsx
import React from 'react';
import '../../styles/Footer.css'; // Footer styles
 
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h4>About Us</h4>
          <p>
            We are a leading online store offering a wide range of products to meet all your needs. 
            Our mission is to provide exceptional service and top-quality products to our customers.
          </p>
        </div>

        {/* Customer Service Section */}
        <div className="footer-section customer-service">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="/help-center">Help Center</a></li>
            <li><a href="/returns">Returns & Refunds</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        {/* Company Info Section */}
        <div className="footer-section company-info">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <ul>
            <li>Email: support@ecommerce.com</li>
            <li>Phone: +1 234 567 890</li>
            <li>Address: 1234 Commerce Ave, Shop City, 98765</li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section social-media">
          <h4>Follow Us</h4>
          <ul className="social-icons">
            <li><a href="https://facebook.com"><i className="fab fa-facebook"></i></a></li>
            <li><a href="https://twitter.com"><i className="fab fa-twitter"></i></a></li>
            <li><a href="https://instagram.com"><i className="fab fa-instagram"></i></a></li>
            <li><a href="https://linkedin.com"><i className="fab fa-linkedin"></i></a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; 2024 E-Commerce Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
 