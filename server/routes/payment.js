import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const stripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/create-checkout-session  { orderId }
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your order' });
    }
    if (order.isPaid) return res.status(400).json({ message: 'Order is already paid' });

    const line_items = order.items.map((i) => ({
      price_data: {
        currency: 'pkr',
        product_data: { name: i.name, images: i.image ? [i.image] : [] },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.qty,
    }));
    if (order.deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: 'pkr',
          product_data: { name: 'Delivery' },
          unit_amount: Math.round(order.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // promo discount → one-off Stripe coupon so the line items still read nicely
    let discounts;
    if (order.discount > 0) {
      const coupon = await stripe().coupons.create({
        amount_off: Math.round(order.discount * 100),
        currency: 'pkr',
        duration: 'once',
        name: order.promoCode ? `Promo ${order.promoCode}` : 'Discount',
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      line_items,
      discounts,
      success_url: `${process.env.CLIENT_URL}/order/${order._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/order/${order._id}?payment=cancelled`,
      metadata: { orderId: order._id.toString() },
    });

    order.stripeSessionId = session.id;
    await order.save();
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payment/verify/:sessionId — confirm payment after redirect
router.get('/verify/:sessionId', protect, async (req, res) => {
  try {
    const session = await stripe().checkout.sessions.retrieve(req.params.sessionId);
    const order = await Order.findById(session.metadata.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (session.payment_status === 'paid' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
      if (order.status === 'pending') {
        order.status = 'confirmed';
        order.statusHistory.push({ status: 'confirmed' });
      }
      await order.save();
    }
    res.json({ isPaid: order.isPaid, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
