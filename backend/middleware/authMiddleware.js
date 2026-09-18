import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { fail } from '../utils/validation.js';
export default async function protect(req, res, next) {
  const token = req.cookies.cartnova_token;
  if (!token) return next(Object.assign(new Error('Please sign in to continue.'), { status: 401 }));
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return next(
      Object.assign(new Error('Your session expired. Please sign in again.'), { status: 401 })
    );
  }
  req.user = await User.findById(payload.id);
  if (!req.user) fail('Please sign in again.', 401);
  next();
}
