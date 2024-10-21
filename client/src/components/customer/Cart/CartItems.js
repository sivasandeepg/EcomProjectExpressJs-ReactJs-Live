import React, { useState } from 'react';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleIncrease = () => {
        onUpdateQuantity(item.product._id, quantity + 1); // Call the parent function to update quantity
        setQuantity(quantity + 1); // Update local state
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            onUpdateQuantity(item.product._id, quantity - 1);
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="cart-item">
            <img src={item.product.imageUrls[0]} alt={item.product.name} />
            <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p>Vendor: {item.vendor.name}</p>
                <p>Price: ₹ {item.priceAtAddTime}</p>
                <div className="quantity-controls">
                    <button onClick={handleDecrease}>-</button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrease}>+</button>
                </div>
                <p>Total: ${(quantity * item.priceAtAddTime).toFixed(2)}</p>
                <button onClick={() => onRemove(item.product._id)}>Remove</button>
            </div>
        </div>
    );
};
  
export default CartItem;
 