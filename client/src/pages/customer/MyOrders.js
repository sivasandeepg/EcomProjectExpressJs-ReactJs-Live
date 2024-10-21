import React from 'react';
import OrderList from '../../components/customer/Orders/OrderList';
  

const MyOrders = ({ token }) => {
  return (
    <div> 
      <OrderList token={token} /> 
    </div>
  );
};

export default MyOrders;
