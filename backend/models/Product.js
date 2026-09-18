import mongoose from 'mongoose';
export const categories = ['Electronics', 'Fashion', 'Accessories', 'Home'];
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 3000 },
    price: { type: Number, required: true, min: 0.01, max: 10000000 },
    category: { type: String, enum: categories, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);
export default mongoose.model('Product', schema);
