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

// إعداد Cloudinary من ENV variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage (بدون تخزين على disk عشان Vercel)
const upload = multer({ storage: multer.memoryStorage() });

// Root route (مهم للتأكد إن السيرفر شغال)
app.get('/', (req, res) => {
  res.send('🚀 ClutchZone API is running');
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// ✅ API لرفع الصور (مباشر إلى Cloudinary)
app.post('/api/upload', upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: "clutchzone_uploads" }, // فولدر داخل Cloudinary
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
      }
      res.json({ success: true, url: result.secure_url });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

// Cars API routes
app.get('/api/cars', (req, res) => {
  res.status(200).json({
    cars: [
      { id: 1, make: 'BMW', model: 'X5', year: 2022, price: 850000, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e' },
      { id: 2, make: 'Mercedes', model: 'C-Class', year: 2021, price: 750000, image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2' },
      { id: 3, make: 'Toyota', model: 'Land Cruiser', year: 2023, price: 2500000, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf' }
    ]
  });
});

app.post('/api/cars', (req, res) => {
  const newCar = {
    id: 4,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.status(201).json({ car: newCar, message: 'Car created successfully' });
});

app.get('/api/cars/:id', (req, res) => {
  const id = parseInt(req.params.id);
  res.status(200).json({
    car: {
      id,
      make: 'BMW',
      model: 'X5',
      year: 2022,
      price: 850000,
      description: 'Luxury SUV with excellent performance and comfort',
      features: ['Leather seats', 'Panoramic roof', 'Navigation system'],
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e',
        'https://images.unsplash.com/photo-1520031441872-956195f7e6a3',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70'
      ]
    }
  });
});

// Properties API routes
app.get('/api/properties', (req, res) => {
  res.status(200).json({
    properties: [
      { id: 1, type: 'Apartment', location: 'New Cairo', area: 150, price: 2500000, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2' },
      { id: 2, type: 'Villa', location: '6th of October', area: 300, price: 5000000, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6' },
      { id: 3, type: 'Apartment', location: 'Sheikh Zayed', area: 180, price: 3000000, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' }
    ]
  });
});

app.post('/api/properties', (req, res) => {
  const newProperty = {
    id: 4,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.status(201).json({ property: newProperty, message: 'Property created successfully' });
});

app.get('/api/properties/:id', (req, res) => {
  const id = parseInt(req.params.id);
  res.status(200).json({
    property: {
      id,
      type: 'Apartment',
      location: 'New Cairo',
      area: 150,
      price: 2500000,
      description: 'Modern apartment with excellent finishing in a prime location',
      features: ['3 bedrooms', '2 bathrooms', 'Fully finished', 'Security'],
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0',
        'https://images.unsplash.com/photo-1560185008-a33f5c7b1844'
      ]
    }
  });
});

// Auth API routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@clutchzone.com' && password === 'admin123') {
    res.status(200).json({
      user: { id: 1, name: 'Admin', email: 'admin@clutchzone.com', role: 'admin' },
      token: 'demo-jwt-token'
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Settings API routes
app.get('/api/settings', (req, res) => {
  try {
    const settings = settingsInstance.getSettings();
    res.status(200).json({ settings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

app.put('/api/settings/logo', (req, res) => {
  try {
    const updatedLogo = settingsInstance.updateLogo(req.body);
    res.status(200).json({ logo: updatedLogo, message: 'Logo updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating logo', error: error.message });
  }
});

app.put('/api/settings/social-media', (req, res) => {
  try {
    const updatedSocialMedia = settingsInstance.updateSocialMedia(req.body);
    res.status(200).json({ socialMedia: updatedSocialMedia, message: 'Social media links updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating social media links', error: error.message });
  }
});

app.put('/api/settings/theme', (req, res) => {
  try {
    const updatedTheme = settingsInstance.updateTheme(req.body);
    res.status(200).json({ theme: updatedTheme, message: 'Theme updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating theme', error: error.message });
  }
});

app.put('/api/settings/contact', (req, res) => {
  try {
    const updatedContact = settingsInstance.updateContact(req.body);
    res.status(200).json({ contact: updatedContact, message: 'Contact information updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact information', error: error.message });
  }
});

app.put('/api/settings/site-info', (req, res) => {
  try {
    const updatedSiteInfo = settingsInstance.updateSiteInfo(req.body);
    res.status(200).json({ siteInfo: updatedSiteInfo, message: 'Site information updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating site information', error: error.message });
  }
});

app.put('/api/settings/:category/:key', (req, res) => {
  try {
    const { category, key } = req.params;
    const { value } = req.body;
    const updatedCategory = settingsInstance.updateSetting(category, key, value);
    res.status(200).json({ [category]: updatedCategory, message: `${category}.${key} updated successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error: error.message });
  }
});

// Start server (لازم 0.0.0.0 مش localhost)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
