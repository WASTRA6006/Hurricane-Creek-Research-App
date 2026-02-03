import dotenv from 'dotenv';
import express from 'express';
import statusRouter from './api/status';
import zoneRouter from './api/zones';
import photoRouter from './api/photos';
import adminPhotoRouter from './api/admin/photos';

dotenv.config();

const app = express();

app.use(express.json());

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
app.use('/api', adminPhotoRouter);


app.listen(PORT, () => {
  const now = new Date();
  console.log("--- " + now.toLocaleString() + " ---");
  console.log("Server is Successfully Running, and App is listening on port " + PORT);
});
