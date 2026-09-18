import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { credentials, requiredText, fail } from '../utils/validation.js';
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});
function signIn(res, user, status = 200) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
  res.cookie('cartnova_token', token, { ...cookieOptions(), maxAge: 7 * 86400000 });
  res.status(status).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
}
export async function register(req, res) {
  const { email, password } = credentials(req.body);
  if (password !== req.body.confirmPassword) fail('Passwords do not match.');
  const name = requiredText(req.body.name, 'Name', 80);
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  signIn(res, user, 201);
}
export async function login(req, res) {
  const { email, password } = credentials(req.body);
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password)))
    fail('Incorrect email or password.', 401);
  signIn(res, user);
}
export function logout(req, res) {
  res.clearCookie('cartnova_token', cookieOptions());
  res.json({ message: 'Signed out.' });
}
export function profile(req, res) {
  res.json(req.user);
}
