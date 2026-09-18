import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { fail, requiredText } from '../utils/validation.js';
export async function placeOrder(req, res) {
  const shippingAddress = {};
  for (const field of ['fullName', 'phone', 'address', 'city', 'state', 'postalCode'])
    shippingAddress[field] = requiredText(req.body.shippingAddress?.[field], field);
  if (!/^[+\d ()-]{7,20}$/.test(shippingAddress.phone)) fail('Enter a valid phone number.');
  if (!/^[\w -]{3,12}$/.test(shippingAddress.postalCode)) fail('Enter a valid postal code.');
  const items = req.body.orderItems;
  if (!Array.isArray(items) || !items.length || items.length > 100)
    fail('Your cart must contain 1 to 100 products.');
  const ids = new Set();
  for (const item of items) {
    if (
      !item ||
      typeof item !== 'object' ||
      !mongoose.isValidObjectId(item.product) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 999 ||
      ids.has(item.product)
    )
      fail('Invalid or duplicate cart item.');
    ids.add(item.product);
  }
  // A transaction prevents partial orders and overselling when shoppers check out together.
  const session = await mongoose.startSession();
  let order;
  try {
    await session.withTransaction(async () => {
      const orderItems = [];
      let totalCents = 0;
      for (const item of items) {
        const product = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );
        if (!product)
          fail('An item is unavailable or has insufficient stock. Please update your cart.', 409);
        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
        });
        totalCents += Math.round(product.price * 100) * item.quantity;
      }
      [order] = await Order.create(
        [{ user: req.user._id, orderItems, shippingAddress, totalAmount: totalCents / 100 }],
        { session }
      );
    });
  } finally {
    await session.endSession();
  }
  res.status(201).json(order);
}
export async function myOrders(req, res) {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
}
export async function allOrders(req, res) {
  res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }));
}
export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) fail('Order not found.', 404);
  if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id))
    fail('You cannot access this order.', 403);
  res.json(order);
}
export async function updateStatus(req, res) {
  const transitions = {
    Processing: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: [],
  };
  const session = await mongoose.startSession();
  let order;
  try {
    await session.withTransaction(async () => {
      order = await Order.findById(req.params.id).session(session);
      if (!order) fail('Order not found.', 404);
      if (!transitions[order.status].includes(req.body.status))
        fail('Invalid order status transition.');
      if (req.body.status === 'Cancelled')
        for (const item of order.orderItems)
          await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
            { session }
          );
      order.status = req.body.status;
      await order.save({ session });
    });
  } finally {
    await session.endSession();
  }
  res.json(order);
}
