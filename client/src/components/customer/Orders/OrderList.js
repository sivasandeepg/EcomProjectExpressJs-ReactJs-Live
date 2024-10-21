import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../../../services/customer/OrderService';
import { useNavigate } from 'react-router-dom';
import '../../../styles/OrderList.css';

// Shipping address component with "Show More/Show Less"
const ShippingAddress = ({ address }) => {
  const [showFullAddress, setShowFullAddress] = useState(false);

  const toggleAddressVisibility = () => {
    setShowFullAddress(prevState => !prevState);
  };

  const addressSummary = `${address.addressLine1}, ${address.city}, ${address.postalCode}`;
  const fullAddress = (
    <>
      <p>{address.fullName}</p>
      <p>{address.addressLine1}</p>
      {address.addressLine2 && <p>{address.addressLine2}</p>}
      <p>{address.city}, {address.state}, {address.postalCode}, {address.country}</p>
      <p>Phone: {address.phoneNumber}</p>
    </>
  );

  return (
    <div className="order-address">
      <h4>SHIP TO :</h4> 
      {showFullAddress ? fullAddress : <p>{addressSummary}</p>}
      <button className="toggle-button" onClick={toggleAddressVisibility}>
        {showFullAddress ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};

const OrderList = ({ token }) => {
  const navigate = useNavigate(); 
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(token);
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [token]); 

    // Function to handle product detail navigation
    const navigateToProductDetails = (productId) => {
      navigate(`/product/${productId}`);
    };
  
    // Function to handle order view navigation
    const navigateToOrderDetails = (orderId) => {
      navigate(`/order/${orderId}`);
    }; 

  return (
    <div className="order-list-container">
      <h3>Orders</h3>
      <div className="order-list">
        {orders.map(order => (
          <div className="order-item" key={order._id}>
            {/* Header with Order ID, Status, and Total Amount */}
            <div className="order-header">
              <h3>Order ID: {order._id}</h3>
              <p>Status: {order.orderStatus}</p>
              <p>Total Amount: ₹{order.totalAmount}</p>
            </div>

            {/* Product and Vendor Details */}
            {order.items.map((item, index) => (
              <div className="order-product" key={index}>
                {/* Product Image */}
                <div className="product-image" onClick={() => navigateToProductDetails(item.product._id)}>  
                  <img src={item.product.imageUrls[0]} alt={item.product.name} />
                </div>
                {/* Product Info */}
                <div className="product-info">
                  <p>{item.product.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.priceAtAddTime}</p>
                  {/* Vendor Details */}
                  <p>Vendor: {item.product.vendor.storeName}</p>
                </div>
              </div>
            ))}

            {/* Shipping Address Component */}
            <ShippingAddress address={order.shippingAddress} />

            <p className="payment-status">Payment Status: {order.paymentStatus}</p>
            <p className="order-date">Order Placed On: {order.placedAt && order.placedAt.$date ? new Date(order.placedAt.$date.$numberLong).toLocaleDateString() : 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
 