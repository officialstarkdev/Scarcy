import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products?category=slug|id&search=&featured=true&sort=price|-price|-rating
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort || '-createdAt');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Dish not found' });
  res.json(product);
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Dish not found' });
  const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (already) return res.status(400).json({ message: 'You have already reviewed this dish' });
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

// Admin CRUD
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Dish not found' });
  res.json(product);
});

router.delete('/:id', protect, admin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Dish not found' });
  res.json({ message: 'Dish removed' });
});

export default router;
