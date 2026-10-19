import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const publicUser = (u, token) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  isAdmin: u.isAdmin,
  addresses: u.addresses,
  ...(token && { token }),
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name, email, password, phone });
    res.status(201).json(publicUser(user, genToken(user._id)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json(publicUser(user, genToken(user._id)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json(publicUser(req.user)));

export default router;
