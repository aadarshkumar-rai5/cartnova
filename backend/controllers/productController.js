import Product, { categories } from '../models/Product.js';
import { fail, requiredText } from '../utils/validation.js';
function productFields(body) {
  const data = {
    name: requiredText(body.name, 'Name', 120),
    description: requiredText(body.description, 'Description', 3000),
    image: requiredText(body.image, 'Image URL', 2000),
    category: body.category,
  };
  if (!categories.includes(data.category)) fail('Choose a valid category.');
  try {
    if (new URL(data.image).protocol !== 'https:') fail('Use an HTTPS image URL.');
  } catch {
    fail('Use a valid HTTPS image URL.');
  }
  for (const key of ['price', 'stock', 'rating']) {
    if (body[key] === '' || body[key] == null || !Number.isFinite(Number(body[key])))
      fail(`Enter a valid ${key}.`);
    data[key] = Number(body[key]);
  }
  data.price = Math.round(data.price * 100) / 100;
  return data;
}
export async function listProducts(req, res) {
  const filter = {};
  if (req.query.search)
    filter.name = {
      $regex: String(req.query.search)
        .slice(0, 120)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.maxPrice) {
    const max = Number(req.query.maxPrice);
    if (!Number.isFinite(max) || max < 0) fail('Invalid maximum price.');
    filter.price = { $lte: max };
  }
  const sort =
    req.query.sort === 'price-asc'
      ? { price: 1 }
      : req.query.sort === 'price-desc'
        ? { price: -1 }
        : { createdAt: -1 };
  res.json(await Product.find(filter).sort(sort));
}
export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) fail('Product not found.', 404);
  res.json(product);
}
export async function addProduct(req, res) {
  res.status(201).json(await Product.create(productFields(req.body)));
}
export async function editProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, productFields(req.body), {
    new: true,
    runValidators: true,
  });
  if (!product) fail('Product not found.', 404);
  res.json(product);
}
export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) fail('Product not found.', 404);
  res.json({ message: 'Product deleted.' });
}
