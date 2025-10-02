import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import initializeParse from '../config/back4app.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import Car from '../models/Car.js';
import Property from '../models/Property.js';
import settingsInstance from '../models/Settings.js';

// Load environment variables
dotenv.config();

// Initialize Parse/Back4App connection
initializeParse();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from client build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ClutchZone API Server is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Configure multer for file uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage });

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Mock data for testing
const mockCars = [
  {
    _id: '1',
    title: 'BMW X5 2023',
    price: 85000,
    year: 2023,
    mileage: 5000,
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera'],
    images: [
      'https://res.cloudinary.com/demo/image/upload/v1/cars/bmw-x5-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v1/cars/bmw-x5-2.jpg'
    ],
    featured: true,
    description: 'Luxury SUV with excellent performance and comfort.',
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'Mercedes-Benz E-Class 2022',
    price: 75000,
    year: 2022,
    mileage: 8000,
    transmission: 'Automatic',
    fuel: 'Diesel',
    features: ['Heated Seats', 'Navigation', 'Bluetooth', 'Parking Sensors'],
    images: [
      'https://res.cloudinary.com/demo/image/upload/v1/cars/mercedes-e-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v1/cars/mercedes-e-2.jpg'
    ],
    featured: true,
    description: 'Elegant sedan with advanced technology and comfort features.',
    createdAt: new Date()
  },
  {
    _id: '3',
    title: 'Audi Q7 2023',
    price: 90000,
    year: 2023,
    mileage: 3000,
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['Panoramic Roof', 'Navigation', 'Bluetooth', '360 Camera'],
    images: [
      'https://res.cloudinary.com/demo/image/upload/v1/cars/audi-q7-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v1/cars/audi-q7-2.jpg'
    ],
    featured: true,
    description: 'Spacious SUV with premium features and powerful performance.',
    createdAt: new Date()
  }
];

const mockProperties = [
  {
    _id: '1',
    title: 'Luxury Villa with Pool',
    price: 1200000,
    location: 'Dubai Marina',
    bedrooms: 5,
    bathrooms: 6,
    area: 5000,
    features: ['Swimming Pool', 'Garden', 'Smart Home', 'Security System'],
    images: [
      'https://res.cloudinary.com/demo/image/upload/v1/properties/villa-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v1/properties/villa-2.jpg'
    ],
    featured: true,
    description: 'Stunning villa with panoramic views and modern amenities.',
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'Modern Apartment in Downtown',
    price: 500000,
    location: 'Downtown Dubai',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    features: ['Gym', 'Pool', 'Parking', 'Concierge'],
    images: [
      'https://res.cloudinary.com/demo/image/upload/v1/properties/apartment-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v1/properties/apartment-2.jpg'
    ],
    featured: true,
    description: 'Contemporary apartment in the heart of the city with stunning views.',
    createdAt: new Date()
  },
  {
    _id: '3',
    title: 'Beachfront Penthouse',
    price: 2500000,
    location: 'Palm Jumeirah',
    bedrooms: 4,
    bathrooms: 5,
    area: 3500,
    features: ['Private Beach', 'Terrace', 'Jacuzzi', 'Home Theater'],
    images: [
      'https://res.cloudinary.com/demo/image/upload/v1/properties/penthouse-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v1/properties/penthouse-2.jpg'
    ],
    featured: true,
    description: 'Exclusive penthouse with direct beach access and luxury amenities.',
    createdAt: new Date()
  }
];

// Cars API routes
app.get('/api/cars', async (req, res) => {
  try {
    // Parse query parameters
    const featured = req.query.featured === 'true';
    const limit = parseInt(req.query.limit) || 10;
    
    // Filter mock data based on query parameters
    let filteredCars = mockCars;
    if (featured) {
      filteredCars = mockCars.filter(car => car.featured);
    }
    
    // Apply limit
    filteredCars = filteredCars.slice(0, limit);
    
    res.status(200).json(filteredCars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Properties API routes
app.get('/api/properties', async (req, res) => {
  try {
    // Parse query parameters
    const featured = req.query.featured === 'true';
    const limit = parseInt(req.query.limit) || 10;
    
    // Filter mock data based on query parameters
    let filteredProperties = mockProperties;
    if (featured) {
      filteredProperties = mockProperties.filter(property => property.featured);
    }
    
    // Apply limit
    filteredProperties = filteredProperties.slice(0, limit);
    
    res.status(200).json(filteredProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/cars', async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json({ car: newCar, message: 'Car created successfully' });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload car images
app.post('/api/cars/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    const uploadPromises = req.files.map(async (file) => {
      const result = await uploadImage(file.path);
      // Delete the local file after upload
      fs.unlinkSync(file.path);
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    });
    
    const uploadedImages = await Promise.all(uploadPromises);
    
    car.images = [...car.images, ...uploadedImages];
    await car.save();
    
    res.status(200).json({ images: car.images, message: 'Images uploaded successfully' });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.status(200).json({ car });
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete car image
app.delete('/api/cars/:id/images/:imageId', async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const car = await Car.findById(id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    const imageToDelete = car.images.find(img => img.public_id === imageId);
    
    if (imageToDelete) {
      await deleteImage(imageToDelete.public_id);
      car.images = car.images.filter(img => img.public_id !== imageId);
      await car.save();
    }
    
    res.status(200).json({ message: 'Image deleted successfully', images: car.images });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Properties API routes
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json({ property: newProperty, message: 'Property created successfully' });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload property images
app.post('/api/properties/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const uploadPromises = req.files.map(async (file) => {
      const result = await uploadImage(file.path);
      // Delete the local file after upload
      fs.unlinkSync(file.path);
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    });
    
    const uploadedImages = await Promise.all(uploadPromises);
    
    property.images = [...property.images, ...uploadedImages];
    await property.save();
    
    res.status(200).json({ images: property.images, message: 'Images uploaded successfully' });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.status(200).json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property image
app.delete('/api/properties/:id/images/:imageId', async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const imageToDelete = property.images.find(img => img.public_id === imageId);
    
    if (imageToDelete) {
      await deleteImage(imageToDelete.public_id);
      property.images = property.images.filter(img => img.public_id !== imageId);
      await property.save();
    }
    
    res.status(200).json({ message: 'Image deleted successfully', images: property.images });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    data: {
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
  
  // Simple authentication for demo purposes
  if (email === 'admin@clutchzone.com' && password === 'admin123') {
    res.status(200).json({
      user: { id: 1, name: 'Admin', email: 'admin@clutchzone.com', role: 'admin' },
      token: 'demo-jwt-token'
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Dashboard API routes
app.get('/api/dashboard/stats', (req, res) => {
  try {
    // Mock dashboard stats for demo purposes
    const stats = {
      totalCars: mockCars.length,
      totalProperties: mockProperties.length,
      totalRequests: 12, // Mock value
      recentActivity: {
        newListings: 5,
        newRequests: 8,
        completedSales: 3
      }
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/dashboard/recent-requests', (req, res) => {
  try {
    // Mock recent purchase requests for demo purposes
    const recentRequests = [
      {
        _id: '1',
        name: 'Ahmed Mohamed',
        email: 'ahmed@example.com',
        phone: '+201234567890',
        itemType: 'car',
        itemId: '1',
        itemTitle: 'BMW X5 2023',
        status: 'pending',
        message: 'I am interested in this car. Please contact me.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        _id: '2',
        name: 'Sara Ahmed',
        email: 'sara@example.com',
        phone: '+201234567891',
        itemType: 'property',
        itemId: '1',
        itemTitle: 'Luxury Villa with Pool',
        status: 'contacted',
        message: 'I would like to schedule a viewing for this property.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        _id: '3',
        name: 'Mohamed Ali',
        email: 'mohamed@example.com',
        phone: '+201234567892',
        itemType: 'car',
        itemId: '2',
        itemTitle: 'Mercedes-Benz E-Class 2022',
        status: 'completed',
        message: 'Is this car still available? I am ready to purchase.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      }
    ];
    
    res.status(200).json({ requests: recentRequests, total: recentRequests.length });
  } catch (error) {
    console.error('Error fetching recent requests:', error);
    res.status(500).json({ message: 'Server error' });
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

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../../client/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ message: 'Client build not found' });
  }
});

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export handler for Vercel
export default function handler(req, res) {
  return app(req, res);
}