import dotenv from 'dotenv';
import express from 'express';
import statusRouter from './api/status.js';
import zoneRouter from './api/zones.js';
import photoRouter from './api/photos.js';
import adminPhotoRouter from './api/admin/photos.js';
import cors from 'cors';
import userRouter from './api/users.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const allowedOrigins = [
  'http://localhost:3001',
  process.env.FRONTEND_URL || 'https://hurricane-creek-research-app.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
  const now = new Date();
  console.log(`[${now.toLocaleString()}] ${req.method} ${req.path}`);
  next();
});

const PORT = Number(process.env.PORT ?? "3000");

// Mount the routes from status.ts under /api
app.use('/api', statusRouter);
// Mount the routes from zones.ts under /api
app.use('/api', zoneRouter);
// Mount the routes from zones.ts under /api
app.use('/api', photoRouter);
// Mount the routes from admin/photos.ts under /api
app.use('/api/admin', adminPhotoRouter);
// Mount the routes from users.ts under /api
app.use('/api', userRouter);


app.listen(PORT, () => {
  const now = new Date();
  console.log("--- " + now.toLocaleString() + " ---");
  console.log("Server is Successfully Running, and App is listening on port " + PORT);
});
