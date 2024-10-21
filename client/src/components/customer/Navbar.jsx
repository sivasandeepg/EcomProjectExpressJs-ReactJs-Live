import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faHome, faHeart } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Navbar.css'; // For navbar-specific styling

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/product/search?query=${encodeURIComponent(searchQuery)}`);
      closeMenu(); // Close the menu on mobile after search
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>RS</h1>
      </div>

      <button 
        className="navbar-toggle" 
        onClick={toggleMenu} 
        aria-label="Toggle Menu" 
        aria-expanded={isOpen}
      >
        ☰
      </button>

      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Sidebar Menu */}
      <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
        {/* Close Button for Sidebar */}
        <button className="close-menu" onClick={closeMenu} aria-label="Close Menu">
          ×
        </button>

        <li>
          <NavLink to="/" exact activeClassName="active" onClick={closeMenu}>
            <FontAwesomeIcon icon={faHome} /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" activeClassName="active" onClick={closeMenu}>
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
          </NavLink>
        </li>
        {user ? (
          <>
            <li>
              <NavLink to="/orders" activeClassName="active" onClick={closeMenu}>
                <FontAwesomeIcon icon={faHeart} /> Orders
              </NavLink> 
            </li>
            <li>
              <NavLink to="/wishlist" activeClassName="active" onClick={closeMenu}>
                <FontAwesomeIcon icon={faHeart} /> Wishlist
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" activeClassName="active" onClick={closeMenu}>
                <FontAwesomeIcon icon={faUser} /> {user?.name || 'Profile'}
              </NavLink>
            </li>
            <li>
              <button onClick={() => { handleLogout(); closeMenu(); }} className="logout-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" activeClassName="active" onClick={closeMenu}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
 