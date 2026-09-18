import mongoose from 'mongoose';
let connectionPromise;

export default async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in backend/.env');
  // Warm serverless requests share a connection; concurrent cold requests share its promise.
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
  }
  try {
    return await connectionPromise;
  } finally {
    connectionPromise = undefined;
  }
}
