import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import vercelHandler from '../../api/index.mjs';
let mongo, shopper, other, admin, product, order;
const shippingAddress = {
  fullName: 'Test Shopper',
  phone: '9876543210',
  address: '42 Test Street',
  city: 'Pune',
  state: 'Maharashtra',
  postalCode: '411001',
};
const fields = {
  name: 'Test Headphones',
  description: 'A test product',
  price: 999.99,
  category: 'Electronics',
  image: 'https://example.com/product.jpg',
  stock: 5,
  rating: 4.5,
};
before(async () => {
  process.env.JWT_SECRET = 'test-only-secret-that-is-over-thirty-two-characters';
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  await User.init();
  shopper = request.agent(app);
  other = request.agent(app);
  admin = request.agent(app);
  await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: await bcrypt.hash('TestPass123!', 4),
    role: 'admin',
  });
  await admin
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'TestPass123!' })
    .expect(200);
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});
test('Vercel entrypoint serves API routes and fails safely when unconfigured', async () => {
  await request(vercelHandler).get('/api/health').expect(200);
  await request(vercelHandler).get('/api/products').expect(200);
  await request(vercelHandler).get('/api/orders/my').expect(401);
  const secret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  const response = {
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  try {
    await vercelHandler({}, response);
    assert.equal(response.statusCode, 503);
    assert.equal(response.body.message, 'The store is not configured yet.');
  } finally {
    process.env.JWT_SECRET = secret;
  }
});

test('registration hashes passwords, uses HttpOnly cookies, and ignores supplied admin role', async () => {
  const response = await shopper
    .post('/api/auth/register')
    .send({
      name: 'Shopper',
      email: 'shop@example.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      role: 'admin',
    })
    .expect(201);
  assert.equal(response.body.role, 'user');
  assert.equal(response.body.password, undefined);
  assert.match(response.headers['set-cookie'][0], /HttpOnly/);
  const user = await User.findOne({ email: 'shop@example.com' }).select('+password');
  assert.notEqual(user.password, 'TestPass123!');
  await shopper.get('/api/auth/profile').expect(200);
  await other
    .post('/api/auth/register')
    .send({
      name: 'Other',
      email: 'other@example.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
    })
    .expect(201);
});
test('rejects duplicate email, bad credentials, unauthenticated requests and cross-origin writes', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Duplicate',
      email: 'shop@example.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
    })
    .expect(409);
  await request(app)
    .post('/api/auth/login')
    .send({ email: 'shop@example.com', password: 'WrongPass123' })
    .expect(401);
  await request(app).get('/api/orders/my').expect(401);
  await shopper
    .post('/api/auth/logout')
    .set('Origin', 'https://untrusted.example')
    .send({})
    .expect(403);
});
test('admin product CRUD is protected and validates data', async () => {
  await shopper.post('/api/products').send(fields).expect(403);
  await shopper.get('/api/users').expect(403);
  await admin
    .post('/api/products')
    .send({ ...fields, stock: -1 })
    .expect(400);
  const response = await admin.post('/api/products').send(fields).expect(201);
  product = response.body;
  await admin
    .put(`/api/products/${product._id}`)
    .send({ ...fields, description: 'Updated description' })
    .expect(200);
  await request(app).get(`/api/products/${product._id}`).expect(200);
  const search = await request(app)
    .get('/api/products?search=Headphones&category=Electronics&maxPrice=1000&sort=price-asc')
    .expect(200);
  assert.equal(search.body.length, 1);
  await request(app).get('/api/products/invalid-id').expect(400);
  const literal = await request(app).get('/api/products?search=%5B').expect(200);
  assert.equal(literal.body.length, 0);
});
test('checkout calculates trusted totals and protects order ownership', async () => {
  const result = await shopper
    .post('/api/orders')
    .send({
      orderItems: [{ product: product._id, quantity: 2, price: 1 }],
      shippingAddress,
      totalAmount: 1,
    })
    .expect(201);
  order = result.body;
  assert.equal(order.totalAmount, 1999.98);
  assert.equal((await Product.findById(product._id)).stock, 3);
  await other.get(`/api/orders/${order._id}`).expect(403);
  await shopper.get(`/api/orders/${order._id}`).expect(200);
  await shopper.get('/api/orders').expect(403);
  await shopper.put(`/api/orders/${order._id}/status`).send({ status: 'Delivered' }).expect(403);
});
test('invalid and unavailable carts do not leave partial stock changes', async () => {
  await shopper
    .post('/api/orders')
    .send({ shippingAddress, orderItems: [null] })
    .expect(400);
  await shopper
    .post('/api/orders')
    .send({ shippingAddress, orderItems: [{ product: product._id, quantity: 99 }] })
    .expect(409);
  await shopper
    .post('/api/orders')
    .send({ shippingAddress, orderItems: [{ product: product._id, quantity: -1 }] })
    .expect(400);
  await shopper
    .post('/api/orders')
    .send({
      shippingAddress,
      orderItems: [
        { product: product._id, quantity: 1 },
        { product: new mongoose.Types.ObjectId().toString(), quantity: 1 },
      ],
    })
    .expect(409);
  assert.equal((await Product.findById(product._id)).stock, 3);
  assert.equal(await Order.countDocuments(), 1);
});
test('cancellation restores inventory once and delivery follows allowed transitions', async () => {
  await admin.put(`/api/orders/${order._id}/status`).send({ status: 'Delivered' }).expect(400);
  await admin.put(`/api/orders/${order._id}/status`).send({ status: 'Cancelled' }).expect(200);
  assert.equal((await Product.findById(product._id)).stock, 5);
  await admin.put(`/api/orders/${order._id}/status`).send({ status: 'Cancelled' }).expect(400);
  assert.equal((await Product.findById(product._id)).stock, 5);
  const response = await shopper
    .post('/api/orders')
    .send({ shippingAddress, orderItems: [{ product: product._id, quantity: 1 }] })
    .expect(201);
  await admin
    .put(`/api/orders/${response.body._id}/status`)
    .send({ status: 'Shipped' })
    .expect(200);
  await admin
    .put(`/api/orders/${response.body._id}/status`)
    .send({ status: 'Delivered' })
    .expect(200);
  const stats = await admin.get('/api/users/stats').expect(200);
  assert.equal(stats.body.revenue, 999.99);
});
test('concurrent checkout cannot oversell the final item', async () => {
  await Product.findByIdAndUpdate(product._id, { stock: 1 });
  const body = { shippingAddress, orderItems: [{ product: product._id, quantity: 1 }] };
  const responses = await Promise.all([
    shopper.post('/api/orders').send(body),
    other.post('/api/orders').send(body),
  ]);
  assert.deepEqual(responses.map((r) => r.status).sort(), [201, 409]);
  assert.equal((await Product.findById(product._id)).stock, 0);
});
test('deleting product preserves order snapshots, and logout clears access', async () => {
  await admin.delete(`/api/products/${product._id}`).send({}).expect(200);
  await request(app).get(`/api/products/${product._id}`).expect(404);
  const response = await shopper.get(`/api/orders/${order._id}`).expect(200);
  assert.equal(response.body.orderItems[0].name, fields.name);
  await shopper.post('/api/auth/logout').send({}).expect(200);
  await shopper.get('/api/auth/profile').expect(401);
});
