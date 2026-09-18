import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
    },
    paymentMethod: { type: String, enum: ['Cash on Delivery'], default: 'Cash on Delivery' },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
  },
  { timestamps: true }
);
export default mongoose.model('Order', schema);
