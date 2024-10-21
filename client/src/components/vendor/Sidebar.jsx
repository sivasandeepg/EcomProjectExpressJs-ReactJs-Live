import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBoxOpen, faTags, faListAlt, faShoppingCart, faUser, faSignOutAlt, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/VendorAuthContext'; // Use the useAuth hook
import '../../styles/Sidebar.css'; 

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // For managing open/close dropdown
  const { vendor, logout } = useAuth(); // Use the useAuth hook to access vendor and logout

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (isSidebarOpen) {
      setIsSidebarOpen(false); // Close sidebar on menu click
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try { 
        await logout(); // Call the logout function from context
      } catch (error) {
        alert("Logout failed. Please try again."); // Error handling
      }
    }
  };

  const handleDropdownToggle = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu); // Toggle the dropdown
  };

  return (
    <>
      <button className="toggle-sidebar" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
      </button>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {vendor && (
          <div className="vendor-info">
            <p>Welcome, {vendor.displayName}!</p>
          </div>
        )}
        <nav aria-label="Vendor navigation"> 
          <ul>
            {/* Dashboard */}
            <li className={activeMenu === 'dashboard' ? 'active' : ''}>
              <NavLink
                to="/vendor/dashboard"
                onClick={() => handleMenuClick('dashboard')}
              >
                <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard 
              </NavLink>
            </li>
            
            {/* Orders Management Dropdown */}
            <li>
              <div
                className="dropdown-toggle"
                onClick={() => handleDropdownToggle('orders')}
              >
                <FontAwesomeIcon icon={faShoppingCart} /> Orders Management 
                <FontAwesomeIcon icon={openDropdown === 'orders' ? faChevronUp : faChevronDown} className="dropdown-icon" />
              </div>
              <ul className={`dropdown-menu ${openDropdown === 'orders' ? 'show' : ''}`}>
                <li>
                  <NavLink
                    to="/vendor/orders-management"
                    onClick={() => handleMenuClick('orders')}
                  >
                    View Orders  
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Product Management Dropdown */}
            <li>
              <div
                className="dropdown-toggle"
                onClick={() => handleDropdownToggle('products')}
              >
                <FontAwesomeIcon icon={faBoxOpen} /> Product Management
                <FontAwesomeIcon icon={openDropdown === 'products' ? faChevronUp : faChevronDown} className="dropdown-icon" />
              </div>
              <ul className={`dropdown-menu ${openDropdown === 'products' ? 'show' : ''}`}>
                <li>
                  <NavLink
                    to="/vendor/manage-products"
                    onClick={() => handleMenuClick('products')}
                  >
                    View Products  
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/vendor/add-product"
                    onClick={() => handleMenuClick('add-products')}
                  >
                    Add Products
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Category Management Dropdown */}
            <li>
              <div
                className="dropdown-toggle"
                onClick={() => handleDropdownToggle('category')}
              >
                <FontAwesomeIcon icon={faListAlt} /> Category Management
                <FontAwesomeIcon icon={openDropdown === 'category' ? faChevronUp : faChevronDown} className="dropdown-icon" />
              </div>
              <ul className={`dropdown-menu ${openDropdown === 'category' ? 'show' : ''}`}>
                <li>
                  <NavLink
                    to="/vendor/category-management"
                    onClick={() => handleMenuClick('add-category')}
                  >
                    Add Category
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Subcategory Management Dropdown */}
            <li>
              <div
                className="dropdown-toggle"
                onClick={() => handleDropdownToggle('subcategory')}
              >
                <FontAwesomeIcon icon={faListAlt} /> Subcategory Management
                <FontAwesomeIcon icon={openDropdown === 'subcategory' ? faChevronUp : faChevronDown} className="dropdown-icon" />
              </div>
              <ul className={`dropdown-menu ${openDropdown === 'subcategory' ? 'show' : ''}`}>
                <li>
                  <NavLink
                    to="/vendor/subcategory-management"
                    onClick={() => handleMenuClick('add-subcategory')}
                  >
                    Add Subcategory
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Brand Management Dropdown */}
            <li>
              <div
                className="dropdown-toggle"
                onClick={() => handleDropdownToggle('brand')}
              >
                <FontAwesomeIcon icon={faTags} /> Brand Management
                <FontAwesomeIcon icon={openDropdown === 'brand' ? faChevronUp : faChevronDown} className="dropdown-icon" />
              </div>
              <ul className={`dropdown-menu ${openDropdown === 'brand' ? 'show' : ''}`}>
                <li>
                  <NavLink
                    to="/vendor/brand-management"
                    onClick={() => handleMenuClick('add-brand')}
                  >
                    Add Brand
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Offer Management Dropdown */}
            <li>
              <div
                className="dropdown-toggle"
                onClick={() => handleDropdownToggle('offer')}
              >
                <FontAwesomeIcon icon={faTags} /> Offer Management
                <FontAwesomeIcon icon={openDropdown === 'offer' ? faChevronUp : faChevronDown} className="dropdown-icon" />
              </div>
              <ul className={`dropdown-menu ${openDropdown === 'offer' ? 'show' : ''}`}>
                <li>
                  <NavLink
                    to="/vendor/add-offer"
                    onClick={() => handleMenuClick('add-offer')}
                  >
                    Add Offer
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Logout */}
            <li>
              <button className="logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
 