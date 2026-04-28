const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  emoji: { type: String, default: '🍽️' }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: Number,
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 49
  },
  total: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  phone: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'upi', 'card', 'wallet'],
    default: 'cod'
  },
  status: {
    type: String,
    enum: ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  instructions: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update updatedAt on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
