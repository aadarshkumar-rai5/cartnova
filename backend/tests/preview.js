// Disposable local preview: real MongoDB, sample products, and no production credentials.
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
import Product from '../models/Product.js';
import products from '../sampleProducts.js';
process.env.NODE_ENV = 'production';
process.env.CLIENT_URL = 'http://localhost:5000';
process.env.JWT_SECRET = randomBytes(48).toString('hex');
const mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
await mongoose.connect(mongo.getUri());
await Product.insertMany(products);
const { default: app } = await import('../app.js');
const server = app.listen(5000, '127.0.0.1', () =>
  console.log('Disposable preview ready at http://localhost:5000')
);
async function stop() {
  server.close();
  await mongoose.disconnect();
  await mongo.stop();
  process.exit();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
