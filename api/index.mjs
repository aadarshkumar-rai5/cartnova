import app from '../backend/app.js';
import connectDB from '../backend/config/db.js';

export default async function handler(req, res) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(503).json({ message: 'The store is not configured yet.' });
  }
  try {
    await connectDB();
  } catch {
    return res.status(503).json({ message: 'The store database is unavailable. Please try again later.' });
  }
  return app(req, res);
}
