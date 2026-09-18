import mongoose from 'mongoose';
export default async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in backend/.env');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
}
