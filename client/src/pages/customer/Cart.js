import React, { useEffect, useState } from 'react';  
import { getCart, removeFromCart, updateCartItemQuantity, applyCoupon, clearCart } from '../../services/customer/CartService'; // Add updateCartItemQuantity
import AuthServices from '../../services/customer/AuthServices'; 
import CartItem from '../../components/customer/Cart/CartItems';  
import CartSummary from '../../components/customer/Cart/CartSummary';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Cart.css';
          
const Cart = () => {
    const { user } = useAuth(); // Check if user is authenticated
    console.log(user)
    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await getCart();
                
                setCart(data);
                calculateTotal(data);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        };
        fetchCart();
    }, []);

    const calculateTotal = (cart) => {
        let total = 0;
        if (cart && cart.items) {
            cart.items.forEach(item => {
                total += item.quantity * item.priceAtAddTime;
            });
        }
        setTotal(total);
    };
  
    const handleRemove = async (productId) => {
        try {
            const updatedCart = await removeFromCart(productId);
            setCart(updatedCart);
            calculateTotal(updatedCart);
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const handleUpdateQuantity = async (productId, quantity) => {
        try {
            const updatedCart = await updateCartItemQuantity(productId, quantity); // API call to update quantity
            setCart(updatedCart);
            calculateTotal(updatedCart);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const handleApplyCoupon = async () => {
        try {
            const updatedCart = await applyCoupon(couponCode); // Send the coupon code to backend
            setCart(updatedCart);
            calculateTotal(updatedCart);
            setCouponError('');
        } catch (error) {
            setCouponError(error.message || 'Failed to apply coupon');
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            setCart({ items: [] }); // Clear the cart in state
            setTotal(0); // Reset the total
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };
  
    const handleCheckout = async () => {
        if (cart && cart.items.length > 0) { 
            const authenticated = await AuthServices.isAuthenticated(); // Access it from AuthServices 

            if (!authenticated) {
               // Save the user's checkout intent before redirecting
                localStorage.setItem('checkoutPending', 'true');
                // Redirect to Login or Signup page
                navigate('/login');
            } else {
                // Proceed to checkout
                navigate('/checkout');
            }
        } else {
            alert("Your cart is empty, add items to proceed to checkout.");
        }
    }; 

    return (
        <div className="cart-page">
            {user ? (
              <p>Shopping Cart</p>    
        ) : (
            <p>Gust Cart</p> 
          )}
            {cart && cart.items && cart.items.length > 0 ? (
                <>
                    <div className="cart-items">
                        {cart.items.map(item => (
                            <CartItem 
                                key={item.product._id} 
                                item={item} 
                                onRemove={handleRemove} 
                                onUpdateQuantity={handleUpdateQuantity} 
                            />
                        ))}
                    </div> 
                    <div className="coupon-section">
                        <input 
                            type="text" 
                            placeholder="Enter coupon code" 
                            value={couponCode} 
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button onClick={handleApplyCoupon}>Apply Coupon</button>
                        {couponError && <p className="error">{couponError}</p>}
                    </div> 
                    <CartSummary total={total} onClear={handleClearCart} onCheckout={handleCheckout} />  
                    
                
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};
 
export default Cart;
