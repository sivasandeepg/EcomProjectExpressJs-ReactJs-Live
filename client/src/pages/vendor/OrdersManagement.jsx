import React, { useState, useEffect } from 'react';
import { fetchVendorOrders, updateOrderStatus } from '../../services/vendor/VendorOrdersService'; 

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define fetchOrders outside of useEffect so it can be reused
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchVendorOrders();
      setOrders(data); // Store orders in state
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
  }, []);
 
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus); // Update the status

      // Re-fetch the orders after a successful status update
      await fetchOrders(); 
      
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Vendor Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order">
            <h3>Order ID: {order._id}</h3>
            <p>Customer: {order.user.email}</p>
            <p>Shipping Address: {order.shippingAddress.addressLine1}, {order.shippingAddress.city}</p>
            <p>Total Amount: ${order.totalAmount}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.product._id}>
                  <strong>Product:</strong> {item.product.name} | <strong>Quantity:</strong> {item.quantity} | <strong>Status:</strong> {item.orderStatus}
                </li>
              ))}
            </ul>
            <select
              value={order.orderStatus}
              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="returned">Returned</option>
              <option value="canceled">Canceled</option>
            </select>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersManagement;
 