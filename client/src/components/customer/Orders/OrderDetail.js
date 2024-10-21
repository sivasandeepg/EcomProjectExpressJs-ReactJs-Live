import React, { useEffect, useState } from 'react';
import { getOrderById } from '../../../services/customer/OrderService'; // Import the named export
import { useParams } from 'react-router-dom';

const OrderDetail = ({ token }) => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id); // Call getOrderById directly
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    fetchOrder();
  }, [id, token]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order._id}</p>
      <p>Status: {order.orderStatus}</p>
      <p>Total: {order.totalAmount}</p>
      {/* Add more order details here */}
    </div>
  );
};

export default OrderDetail;
 