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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
  origin: 'http://localhost:3001',  // Allow requests from frontend
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
