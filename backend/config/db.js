import mongoose from 'mongoose';
let connectionPromise;

export default async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error('Set MONGO_URI or connect MongoDB Atlas through Vercel.');
  // Warm serverless requests share a connection; concurrent cold requests share its promise.
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
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
