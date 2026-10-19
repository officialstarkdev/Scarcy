import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';
import promoRoutes from './routes/promos.js';
import uploadRoutes from './routes/upload.js';
import path from 'path';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', name: 'Zaiqa API' }));
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Zaiqa API running on http://localhost:${PORT}`));
