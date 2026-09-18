import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import { credentials, requiredText } from './utils/validation.js';
try {
  const { email, password } = credentials({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  const name = requiredText(process.env.ADMIN_NAME, 'ADMIN_NAME', 80);
  await connectDB();
  if (await User.exists({ email }))
    throw new Error(
      'Account already exists. Use a new admin email; this script never changes an existing account.'
    );
  await User.create({ name, email, password: await bcrypt.hash(password, 12), role: 'admin' });
  console.log('Admin created. Sign in with the credentials you supplied.');
} finally {
  await mongoose.disconnect();
}
