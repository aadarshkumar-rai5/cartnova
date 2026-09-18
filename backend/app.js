import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
const app = express();
app.set('trust proxy', 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", 'https:', 'data:'],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
  })
);
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
// JSON-only writes plus origin checks protect cookie-authenticated mutations from CSRF.
app.use('/api', (req, res, next) => {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    if (!req.is('application/json')) return res.status(415).json({ message: 'Send JSON content.' });
    const allowed = process.env.CLIENT_URL || 'http://localhost:5173';
    if (req.headers.origin && req.headers.origin !== allowed)
      return res.status(403).json({ message: 'Origin not allowed.' });
  }
  next();
});
app.get('/api/health', (req, res) =>
  res
    .status(mongoose.connection.readyState === 1 ? 200 : 503)
    .json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'database unavailable' })
);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found.' }));
if (process.env.NODE_ENV === 'production') {
  const dist = fileURLToPath(new URL('../frontend/dist/', import.meta.url));
  app.use(express.static(dist));
  app.get('/{*path}', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}
app.use(errorMiddleware);
export default app;
