import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VendorLayout from '../layouts/VendorLayout'; // Layout with Sidebar
import Loader from '../components/shared/Loader'; // Loader Component
import NotFound from '../pages/error/NotFound'; // 404 Page
import { VendorAuthProvider } from '../context/VendorAuthContext'; // Vendor Auth Context
import VendorPrivateRoute from './VendorPrivateRoute';
// Product & Category Management Components
import AddEditProduct from '../components/vendor/VendorProducts/AddEditProduct';
import AddEditCategory from '../components/vendor/ProductsCategories/AddEditCategory';
import AddEditSubcategory from '../components/vendor/ProductsCategories/AddEditSubcategory';
import AddEditBrand from '../components/vendor/ProductsCategories/AddEditBrand';
import AddEditModel from '../components/vendor/ProductsCategories/AddEditModel';
import AddEditSize from '../components/vendor/ProductsCategories/AddEditSize';

// Authentication Pages
import AdminLogin from '../pages/auth/VendorLogin';
import AdminSignup from '../pages/auth/VendorSignup';

// Vendor Auth Context and Private Route Protection
import ErrorBoundary from '../components/shared/ErrorBoundary';

// Lazy load vendor pages for performance optimization
const Dashboard = lazy(() => import('../pages/vendor/Dashboard'));
const ManageProducts = lazy(() => import('../pages/vendor/ManageProducts'));
const ManageUsers = lazy(() => import('../pages/vendor/ManageUsers'));
const OrdersManagement = lazy(() => import('../pages/vendor/OrdersManagement'));


const VendorRoutes = () => {
  return (  
    <VendorAuthProvider>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public Routes (Login & Signup) */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/login-failed" element={<AdminLogin />} />
            <Route path="/registration" element={<AdminSignup />} />

            {/* Private Routes with Sidebar */}
            <Route
              path="/*"
              element={
                <VendorPrivateRoute>
                  <VendorLayout>
                    <Suspense fallback={<Loader />}>
                      <Routes>
                        {/* Protected Routes */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* ... other routes ... */}
          
                         <Route path="/manage-products" element={<ManageProducts />} />
                         <Route path="/add-product" element={<AddEditProduct />} />
                         <Route path="/edit-product/:id" element={<AddEditProduct />} /> {/* Edit product by ID */}

                         {/* Product Categories Management */}
                         <Route path="/category-management" element={<AddEditCategory />} />
                         <Route path="/subcategory-management" element={<AddEditSubcategory />} />
                         <Route path="/brand-management" element={<AddEditBrand />} />
                         <Route path="/model-management" element={<AddEditModel />} />
                        <Route path="/size-management" element={<AddEditSize />} />

                         {/* Manage Users & Orders */}
                         <Route path="/manage-users" element={<ManageUsers />} />
                         <Route path="/orders-management" element={<OrdersManagement />} />
                        <Route path="/" element={<Dashboard />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </VendorLayout>
                </VendorPrivateRoute> 
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </VendorAuthProvider>
  );
};


export default VendorRoutes;
