import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import products from './sampleProducts.js';
try {
  await connectDB();
  // Insert missing samples only; rerunning never overwrites inventory or deletes data.
  for (const product of products)
    await Product.updateOne(
      { name: product.name },
      { $setOnInsert: product },
      { upsert: true, runValidators: true }
    );
  console.log('Sample products are ready. Existing products were preserved.');
} finally {
  await mongoose.disconnect();
}
