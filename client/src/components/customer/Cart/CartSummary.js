// src/components/customer/cart/CartSummary.js
import React from 'react';

const CartSummary = ({ total, onClear, onCheckout }) => {
    return (
        <div className="cart-summary">
            <h2>Cart Summary</h2>
            <p>Total: ₹ {total}</p>
            <button onClick={onClear}>Clear Cart</button>
            <button onClick={onCheckout}>Proceed to Checkout</button> {/* Added Checkout button */}
        </div>
    );
};

export default CartSummary;
 