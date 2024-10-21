const Order = require('../../models/Order');
  
// Get all orders for a specific vendor
exports.getVendorOrders = async (req, res) => {
  const { id } = req.vendor;
    const vendorId = id; // Get vendor ID from the decoded token
      console.log(vendorId)
  try { 
    // Fetch orders where the items' vendor matches the vendorId
    const orders = await Order.find({
      'items.vendor': vendorId,
    }).populate('user', 'email') // Fetch user info
      .populate('items.product', 'name price'); // Populate product details

    res.json(orders);
  } catch (err) {
    console.error('Error fetching vendor orders:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update the order status by vendor
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;
  const vendorId = req.vendor.id;

  try {
    // Find the order and check if the vendor is allowed to update it
    const order = await Order.findOne({
      _id: orderId,
      'items.vendor': vendorId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to update this order' });
    }

    // Update the status for the specific items belonging to the vendor
    order.items.forEach((item) => {
      if (item.vendor.toString() === vendorId) {
        item.orderStatus = orderStatus;
      }
    });

    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Get a specific order by ID for a vendor
exports.getVendorOrderById = async (req, res) => {
  const { orderId } = req.params;
  const vendorId = req.vendor.id;

  try {
    // Find the order by ID and check if it contains items belonging to the vendor
    const order = await Order.findOne({
      _id: orderId,
      'items.vendor': vendorId, // Ensure that the vendor is part of the order
    })
      .populate('user', 'email') // Fetch user details
      .populate('items.product', 'name price'); // Populate product details

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to view this order' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
