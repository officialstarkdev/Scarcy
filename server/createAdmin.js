import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.findOneAndUpdate(
      { email: 'admin@zaiqa.com' },
      {
        name: 'Zaiqa Admin',
        email: 'admin@zaiqa.com',
        password: hashedPassword,
        isAdmin: true,
        phone: '0300-0000000',
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log('Admin account ready:');
    console.log(admin.email);
    console.log('isAdmin:', admin.isAdmin);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();