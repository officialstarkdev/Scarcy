import express from 'express';
import Order, { ORDER_STATUSES } from '../models/Order.js';
import Product from '../models/Product.js';
import PromoCode from '../models/PromoCode.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

const DELIVERY_FEE = () => Number(process.env.DELIVERY_FEE || 150);
const FREE_ABOVE = () => Number(process.env.FREE_DELIVERY_ABOVE || 2500);

// POST /api/orders  — create order (prices are re-computed server-side)
router.post('/', protect, async (req, res) => {
  try {
    const { items, address, paymentMethod, promoCode } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Your cart is empty' });
    if (!address?.street || !address?.area || !address?.phone) {
      return res.status(400).json({ message: 'Delivery address and phone are required' });
    }

    const ids = items.map((i) => i.product);
    const dbProducts = await Product.find({ _id: { $in: ids } });

    const orderItems = items.map((i) => {
      const p = dbProducts.find((d) => d._id.toString() === i.product);
      if (!p) throw new Error('One of the dishes is no longer on the menu');
      if (!p.isAvailable) throw new Error(`${p.name} is currently unavailable`);
      return { product: p._id, name: p.name, image: p.image, price: p.price, qty: Number(i.qty) };
    });

    const itemsPrice = orderItems.reduce((a, i) => a + i.price * i.qty, 0);
    const deliveryFee = itemsPrice >= FREE_ABOVE() ? 0 : DELIVERY_FEE();

    // promo (re-validated server-side; never trust the client's discount)
    let discount = 0;
    let promo = null;
    if (promoCode?.trim()) {
      promo = await PromoCode.findOne({ code: promoCode.trim().toUpperCase() });
      if (!promo) throw new Error("That promo code isn't on our books");
      discount = promo.priceFor(itemsPrice);
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      address,
      paymentMethod: paymentMethod === 'card' ? 'card' : 'cod',
      promoCode: promo ? promo.code : '',
      discount,
      itemsPrice,
      deliveryFee,
      totalPrice: itemsPrice + deliveryFee - discount,
      statusHistory: [{ status: 'pending' }],
    });
    if (promo) await PromoCode.updateOne({ _id: promo._id }, { $inc: { usedCount: 1 } });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/mine
router.get('/mine', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
});

// GET /api/orders — admin, all orders
router.get('/', protect, admin, async (req, res) => {
  const { status } = req.query;
  const filter = status && status !== 'all' ? { status } : {};
  const orders = await Order.find(filter).populate('user', 'name email').sort('-createdAt');
  res.json(orders);
});

// GET /api/orders/:id — owner or admin
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your order' });
  }
  res.json(order);
});

// PUT /api/orders/:id/status — admin
router.put('/:id/status', protect, admin, async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  order.statusHistory.push({ status });
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    if (order.paymentMethod === 'cod') {
      order.isPaid = true;
      order.paidAt = new Date();
    }
  }
  await order.save();
  res.json(order);
});

export default router;
