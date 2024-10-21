import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import Loader from '../components/shared/Loader';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/auth/Login';
import { AuthProvider } from '../context/AuthContext'; // Import AuthProvider
import GoogleCallback from '../components/auth/GoogleCallback';
import ErrorPage from '../pages/error/ErrorPage';
import ProductDetails from '../components/customer/Products/ProductDetails';
import Products from '../pages/customer/Products';
import Checkout from '../pages/customer/Checkout';
import SuccessPage from '../pages/customer/SuccessPage';
import FailurePage from '../pages/customer/FailurePage';
import MyOrders from '../pages/customer/MyOrders';
 
 

// Lazy load the customer pages
const Home = lazy(() => import('../pages/customer/Home'));

const Cart = lazy(() => import('../pages/customer/Cart'));
const Wishlist = lazy(() => import('../pages/customer/Wishlist'));
const Profile = lazy(() => import('../pages/customer/Profile'));
const NotFound = lazy(() => import('../pages/error/NotFound'));
 
const CustomerRoutes = () => {
  return (
    <AuthProvider>
      <CustomerLayout>
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
          <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<GoogleCallback />} />

                  {/* Allow guests to access the Home , Product, Search & cart */}
                 <Route path="/" element={<Home />} />
                 <Route path="/cart" element={<Cart />} />
                 <Route path="/product/:id" element={<ProductDetails />}  /> 
                 <Route path="/product/search" element={<Products />}  />
                   
                {/* Wrap each private route individually */}

                <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
                <Route path="/checkout" element={<PrivateRoute element={<Checkout />} />} />
                <Route path="/success/:orderId" element={<PrivateRoute element={<SuccessPage />} />} />
                <Route path="/orders" element={<PrivateRoute element={<MyOrders />} />} />
                <Route path="/wishlist" element={<PrivateRoute element={<Wishlist />} />} />
                <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

                <Route path="/failure" element={<FailurePage />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<NotFound />} />
          </Routes>

          </Suspense>
        </ErrorBoundary>
      </CustomerLayout>
    </AuthProvider> 
  );
};
  
export default CustomerRoutes;
  