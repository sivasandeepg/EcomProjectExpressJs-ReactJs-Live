import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthServices from '../../services/customer/AuthServices';
import { getGustCart, mergeGuestCartWithUserCart } from '../../services/customer/CartService';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const authenticateUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        try {
          // Store token in localStorage
          localStorage.setItem('authToken', token);

          // Fetch user profile using AuthServices
          const user = await AuthServices.getProfile();
          setUser(user.user); // Update user in context

          // Check if guest cart has items before merging  
          const guestCart = await getGustCart(); // Get the guest cart

          // Proceed only if there are items in the guest cart
          if (guestCart && guestCart.items && guestCart.items.length > 0) {
            // Merge guest cart with user cart if items are found in guest cart
            const mergedCart = await mergeGuestCartWithUserCart(); 
            console.log('Cart merged successfully:', mergedCart);
          } else {
            console.log('No items found in guest cart, skipping merge.');
          }
        
          // Redirect based on checkout intent
          const checkoutPending = localStorage.getItem('checkoutPending');
          if (checkoutPending) {
            localStorage.removeItem('checkoutPending');
            navigate('/checkout'); // Go to checkout if the user was trying to check out
          } else {
            navigate('/'); // Otherwise, go to the home page
          } 

        } catch (error) {
          // Handle error and redirect to error page with the error message
          navigate('/error', { state: { error: error.message } });
        }
      } else {
        // Handle case where no token is provided in URL
        navigate('/error', { state: { error: 'Token not provided in URL' } });
      }
    };

    authenticateUser();
  }, [navigate, setUser]);

  return <div>Authenticating...</div>; // Display loading or spinner
};

export default GoogleCallback;
 