import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../services/customer/OrderService'; 
import '../../styles/SuccessPage.css';

const SuccessPage = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const navigate = useNavigate();

    // Fetch order details
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderData = await getOrderById(orderId);
                setOrderDetails(orderData.order);
            } catch (error) {
                console.error('Failed to fetch order details:', error);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    // Auto-redirect after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/orders'); // Redirect to the orders page
        }, 10000); // 10 seconds

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [navigate]);

    const handleRedirectToOrders = () => {
        navigate('/orders'); // Manual redirect to orders page
    };

    const handleContinueShopping = () => {
        navigate('/shop'); // Redirect to the shop page
    };

    return (
        <div className="success-page">
            {orderDetails ? (
                <div className="success-card">
                    <div className="success-animation">
                        <h1>Congratulations!</h1>
                    </div>
                    <h2>Thank you for your order!</h2>
                    <h3>Order ID: {orderDetails._id}</h3>
                    <h4>Payment Details</h4>
                    <p>Payment ID: {orderDetails.paymentIntentId}</p>
                    <p>Total: ₹{orderDetails.totalAmount}</p>

                    <h4>Order Summary</h4>
                    {orderDetails.items && orderDetails.items.length > 0 ? (
                        orderDetails.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <p>Product: {item.product.name}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ₹{item.priceAtAddTime}</p>
                            </div>
                        ))
                    ) : (
                        <p>No items found in this order.</p>
                    )}

                    <h4>Shipping Address</h4>
                    <p>{orderDetails.shippingAddress.fullName}</p>
                    <p>{orderDetails.shippingAddress.addressLine1}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}, {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.country}</p>

                    {/* Redirect buttons */}
                    <button onClick={handleRedirectToOrders} className="redirect-button">View My Orders</button>
                    <button onClick={handleContinueShopping} className="continue-shopping-button">Continue Shopping</button>
                </div>
            ) : (
                <p>Loading order details...</p>
            )}
        </div>
    );
};

export default SuccessPage;
 