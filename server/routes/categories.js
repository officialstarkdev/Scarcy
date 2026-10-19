import express from 'express';
import Category from '../models/Category.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await Category.find().sort('sortOrder name');
  res.json(categories);
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, tagline, image, sortOrder } = req.body;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const category = await Category.create({ name, slug, tagline, image, sortOrder });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

router.delete('/:id', protect, admin, async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category removed' });
});

export default router;
