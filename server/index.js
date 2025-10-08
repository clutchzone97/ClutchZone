import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';

// Import routes
import carRoutes from './routes/cars.js';
import propertyRoutes from './routes/properties.js';
import settingsRoutes from './routes/settings.js';
import authRoutes from './routes/auth.js';
import requestRoutes from './routes/requests.js';

// Load environment variables
dotenv.config();

const app = express();

// --- In-Memory Storage Fallback ---
app.locals.isMongoConnected = false;
app.locals.inMemoryCars = [];
app.locals.inMemoryProperties = [];
app.locals.inMemoryRequests = [];

// Create a default in-memory admin user
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash('maxstorm@012', salt);
app.locals.inMemoryUsers = [{
  _id: new mongoose.Types.ObjectId().toHexString(),
  email: 'admin@clutchzone.com',
  password: hashedPassword,
  role: 'admin',
  matchPassword: async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}];

// Default settings
app.locals.inMemorySettings = {
  _id: new mongoose.Types.ObjectId().toHexString(),
  siteInfo: { title: "ClutchZone", description: "Your new home and car are here." },
  contact: { phone: "", email: "", address: "" },
  socialMedia: { facebook: "", twitter: "", instagram: "" },
  theme: { primaryColor: "#3b82f6", secondaryColor: "#10b981" }
};
// --- End In-Memory Storage ---

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.locals.isMongoConnected = true;
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("🔄 Using in-memory storage as a fallback.");
    app.locals.isMongoConnected = false;
  });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// API Routes
app.use('/api/cars', carRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

// --- Deployment ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}
// --- End Deployment ---

// Not found middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 10000;

// Prevent EADDRINUSE error during tests
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});