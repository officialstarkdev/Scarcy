import express from 'express';
import PromoCode from '../models/PromoCode.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/promos/validate  { code, subtotal } — customer, dry-run check
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code?.trim()) return res.status(400).json({ message: 'Enter a promo code' });
    const promo = await PromoCode.findOne({ code: code.trim().toUpperCase() });
    if (!promo) return res.status(404).json({ message: "That code isn't on our books" });
    const discount = promo.priceFor(Number(subtotal) || 0);
    res.json({ code: promo.code, discount, type: promo.type, value: promo.value });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin CRUD
router.get('/', protect, admin, async (req, res) => {
  const promos = await PromoCode.find().sort('-createdAt');
  res.json(promos);
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const promo = await PromoCode.create(req.body);
    res.status(201).json(promo);
  } catch (err) {
    const message = err.code === 11000 ? 'That code already exists' : err.message;
    res.status(400).json({ message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!promo) return res.status(404).json({ message: 'Promo not found' });
    res.json(promo);
  } catch (err) {
    const message = err.code === 11000 ? 'That code already exists' : err.message;
    res.status(400).json({ message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  const promo = await PromoCode.findByIdAndDelete(req.params.id);
  if (!promo) return res.status(404).json({ message: 'Promo not found' });
  res.json({ message: 'Promo removed' });
});

export default router;
