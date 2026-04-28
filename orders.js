const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// Generate unique order ID
const generateOrderId = () => {
  return 'QB' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// @route   POST /api/orders
// @desc    Place a new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { restaurantId, restaurantName, items, subtotal, deliveryAddress, phone, paymentMethod, instructions } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!deliveryAddress || !deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required' });
    }

    const deliveryFee = 49;
    const total = subtotal + deliveryFee;

    let orderId;
    let isUnique = false;
    while (!isUnique) {
      orderId = generateOrderId();
      const existing = await Order.findOne({ orderId });
      if (!existing) isUnique = true;
    }

    const order = await Order.create({
      orderId,
      user: req.user.id,
      restaurantId,
      restaurantName,
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      phone,
      paymentMethod: paymentMethod || 'cod',
      instructions: instructions || '',
      status: 'placed'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        orderId: order.orderId,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error placing order' });
  }
});

// @route   GET /api/orders/my
// @desc    Get all orders for logged-in user
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/orders/:orderId
// @desc    Get single order by orderId
// @access  Private
router.get('/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure user can only see their own orders (unless admin)
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status (admin only)
// @access  Private + Admin
router.put('/:orderId/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/orders (Admin)
// @desc    Get all orders (admin only)
// @access  Private + Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
