import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
export async function listUsers(req, res) {
  res.json(await User.find().select('name email role createdAt').sort({ createdAt: -1 }));
}
export async function dashboard(req, res) {
  const [products, orders, users, revenue] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
    Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
  ]);
  res.json({ products, orders, users, revenue: revenue[0]?.total || 0 });
}
