import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import settingsInstance from './models/Settings.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Root route (مهم للتأكد إن السيرفر شغال)
app.get('/', (req, res) => {
  res.send('🚀 ClutchZone API is running');
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const stream = cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ url: result.secure_url });
  });

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

// ... باقي الـ APIs اللي عندك (cars, properties, auth, settings)

// Start server (لازم 0.0.0.0 مش localhost)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
