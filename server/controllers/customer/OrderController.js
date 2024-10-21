const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/User'); 
const vendor = require('../../models/Vendor');  
 
// Create a new order after successful payment
exports.createOrder = async (req, res) => { 
  try {
    const { items, shippingAddress, total, paymentIntentId } = req.body;

    // Create new order object
    const order = new Order({
      user: req.user.id, // Assuming user is authenticated
      items: items.map(item => ({
        product: item.product, 
        quantity: item.quantity,
        priceAtAddTime: item.priceAtAddTime,
        discount: item.discount,
        vendor: item.vendor, // Assume vendor is included in each item
        orderStatus: 'pending', // Default order status for items
        trackingInfo: {
          trackingNumber: item.trackingNumber,
          carrier: item.carrier,
          trackingUrl: item.trackingUrl,
        },
        deliveryDate: item.deliveryDate, // Include delivery date if available
      })),
      shippingAddress,
      paymentIntentId,
      totalAmount: total,
      paymentStatus: 'completed', // Assume payment is successful
      orderStatus: 'pending', // Overall order status
    });

    // Save the order
    const savedOrder = await order.save();

    // Decrement stock for each product
    for (const item of items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stockQuantity -= item.quantity;
        await product.save();
      }
    }
    console.log(savedOrder);
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// Get all orders for the logged-in user
// exports.getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user.id }).populate('items.product');   
//     // const orders = await Order.find({ user: req.user.id }).populate('items.product vendor');

//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error('Error fetching user orders:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch orders' });
//   }
// };

// Get all orders for the logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'items.product', // Populate the product details in items
        populate: {
          path: 'vendor', // Ensure the vendor is populated from the product
          model: 'User',  // Ensure the correct model for vendor is used
          select: 'storeName email', // Fetch relevant fields (adjust as necessary)
        },
      });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found' });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

 

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// Update order status (e.g., by an admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = orderStatus;
    order.updatedAt = Date.now();

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};
 