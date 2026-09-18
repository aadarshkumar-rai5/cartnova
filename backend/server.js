import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
  throw new Error('Set JWT_SECRET to a random value of at least 32 characters.');
await connectDB();
app.listen(process.env.PORT || 5000, '0.0.0.0', () =>
  console.log(`CartNova API listening on ${process.env.PORT || 5000}`)
);
