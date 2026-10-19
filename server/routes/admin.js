import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/stats — dashboard numbers
router.get('/stats', protect, admin, async (req, res) => {
  const [orders, products, users] = await Promise.all([
    Order.find(),
    Product.countDocuments(),
    User.countDocuments({ isAdmin: false }),
  ]);

  const delivered = orders.filter((o) => o.status === 'delivered');
  const revenue = delivered.reduce((a, o) => a + o.totalPrice, 0);
  const active = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;

  // last 7 days revenue for the chart
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const daily = days.map((day) => {
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const dayOrders = orders.filter((o) => o.createdAt >= day && o.createdAt < next);
    return {
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((a, o) => a + o.totalPrice, 0),
    };
  });

  res.json({
    totalOrders: orders.length,
    activeOrders: active,
    revenue,
    products,
    customers: users,
    daily,
  });
});

export default router;
