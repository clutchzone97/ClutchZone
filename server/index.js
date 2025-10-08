import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import Car from "./models/Car.js";
import Property from "./models/Property.js";
import { uploadImage, deleteImage } from "./config/cloudinary.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// In-memory storage for development/testing when MongoDB is not available
let inMemoryProperties = [];
let inMemoryCars = [];
let isMongoConnected = false;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    isMongoConnected = true;
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log("🔄 Using in-memory storage for development");
    isMongoConnected = false;
  });

// Cars API routes
app.get("/api/cars", async (req, res) => {
  try {
    if (isMongoConnected) {
      const cars = await Car.find().sort({ createdAt: -1 });
      res.status(200).json(cars);
    } else {
      // For in-memory storage
      const sortedCars = inMemoryCars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.status(200).json(sortedCars);
    }
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ message: "Failed to fetch cars" });
  }
});

app.post("/api/cars", async (req, res) => {
  try {
    if (isMongoConnected) {
      const car = new Car(req.body);
      await car.save();
      res.status(201).json(car);
    } else {
      // For in-memory storage
      const newCar = {
        _id: Date.now().toString(),
        ...req.body,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryCars.push(newCar);
      res.status(201).json(newCar);
    }
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).json({ message: "Failed to add car" });
  }
});

app.get("/api/cars/:id", async (req, res) => {
  try {
    if (isMongoConnected) {
      const car = await Car.findById(req.params.id);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.status(200).json(car);
    } else {
      // For in-memory storage
      const car = inMemoryCars.find(c => c._id === req.params.id);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.status(200).json(car);
    }
  } catch (err) {
    console.error("Error fetching car:", err);
    res.status(500).json({ message: "Failed to fetch car" });
  }
});

app.put("/api/cars/:id", async (req, res) => {
  try {
    if (isMongoConnected) {
      const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.status(200).json(car);
    } else {
      // For in-memory storage
      const index = inMemoryCars.findIndex(c => c._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Car not found" });
      }
      inMemoryCars[index] = { ...inMemoryCars[index], ...req.body, updatedAt: new Date() };
      res.status(200).json(inMemoryCars[index]);
    }
  } catch (err) {
    console.error("Error updating car:", err);
    res.status(500).json({ message: "Failed to update car" });
  }
});

app.delete("/api/cars/:id", async (req, res) => {
  try {
    if (isMongoConnected) {
      const car = await Car.findByIdAndDelete(req.params.id);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.status(200).json({ message: "Car deleted successfully" });
    } else {
      // For in-memory storage
      const index = inMemoryCars.findIndex(c => c._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Car not found" });
      }
      inMemoryCars.splice(index, 1);
      res.status(200).json({ message: "Car deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting car:", err);
    res.status(500).json({ message: "Failed to delete car" });
  }
});

// Upload car images
app.post('/api/cars/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    if (isMongoConnected) {
      const car = await Car.findById(req.params.id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }

      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await uploadImage(file.path);
          // Delete the local file after upload
          fs.unlinkSync(file.path);
          return {
            url: result.secure_url,
            public_id: result.public_id
          };
        } catch (error) {
          console.error('Cloudinary upload failed, using local storage:', error);
          // Fallback to local storage if Cloudinary fails
          return {
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            public_id: `local_${Date.now()}_${Math.random()}`
          };
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      car.images = [...car.images, ...uploadedImages];
      await car.save();

      res.status(200).json({ images: car.images, message: 'Images uploaded successfully' });
    } else {
      // For in-memory storage, just return mock URLs
      const mockImages = req.files.map((file, index) => ({
        url: `http://localhost:10000/uploads/${file.filename}`,
        public_id: `mock_${Date.now()}_${index}`
      }));
      
      const car = inMemoryCars.find(c => c._id === req.params.id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
      
      if (!car.images) car.images = [];
      car.images = [...car.images, ...mockImages];
      
      res.status(200).json({ images: car.images, message: 'Images uploaded successfully' });
    }
  } catch (error) {
    console.error('Error uploading car images:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

// Properties API routes
app.get("/api/properties", async (req, res) => {
  try {
    if (isMongoConnected) {
      const properties = await Property.find().sort({ createdAt: -1 });
      res.status(200).json(properties);
    } else {
      // Use in-memory storage
      const sortedProperties = inMemoryProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.status(200).json(sortedProperties);
    }
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

app.post("/api/properties", async (req, res) => {
  try {
    if (isMongoConnected) {
      const property = new Property(req.body);
      await property.save();
      res.status(201).json(property);
    } else {
      // Use in-memory storage
      const property = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date()
      };
      inMemoryProperties.push(property);
      console.log("✅ Property added to in-memory storage:", property);
      res.status(201).json(property);
    }
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ message: "Failed to create property" });
  }
});

app.get("/api/properties/:id", async (req, res) => {
  try {
    if (isMongoConnected) {
      const property = await Property.findById(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(200).json(property);
    } else {
      const property = inMemoryProperties.find(p => p._id === req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(200).json(property);
    }
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(500).json({ message: "Failed to fetch property" });
  }
});

app.put("/api/properties/:id", async (req, res) => {
  try {
    if (isMongoConnected) {
      const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(200).json(property);
    } else {
      const index = inMemoryProperties.findIndex(p => p._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Property not found" });
      }
      inMemoryProperties[index] = { ...inMemoryProperties[index], ...req.body };
      res.status(200).json(inMemoryProperties[index]);
    }
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ message: "Failed to update property" });
  }
});

app.delete("/api/properties/:id", async (req, res) => {
  try {
    if (isMongoConnected) {
      const property = await Property.findByIdAndDelete(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(200).json({ message: "Property deleted successfully" });
    } else {
      const index = inMemoryProperties.findIndex(p => p._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Property not found" });
      }
      inMemoryProperties.splice(index, 1);
      res.status(200).json({ message: "Property deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ message: "Failed to delete property" });
  }
});

// Upload property images
app.post('/api/properties/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    if (isMongoConnected) {
      const property = await Property.findById(req.params.id);
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
    } else {
      // For in-memory storage, just return mock URLs
      const mockImages = req.files.map((file, index) => ({
        url: `http://localhost:10000/uploads/${file.filename}`,
        public_id: `mock_${Date.now()}_${index}`
      }));
      
      const property = inMemoryProperties.find(p => p._id === req.params.id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      if (!property.images) property.images = [];
      property.images = [...property.images, ...mockImages];
      
      res.status(200).json({ images: property.images, message: 'Images uploaded successfully' });
    }
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

// Dashboard stats
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalProperties = await Property.countDocuments();
    
    res.status(200).json({
      totalCars,
      totalProperties,
      totalListings: totalCars + totalProperties
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

// Recent requests (placeholder)
app.get("/api/dashboard/recent-requests", async (req, res) => {
  try {
    // For now, return empty array since we don't have a requests model yet
    res.status(200).json([]);
  } catch (err) {
    console.error("Error fetching recent requests:", err);
    res.status(500).json({ message: "Failed to fetch recent requests" });
  }
});

// Auth API routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple authentication for demo purposes
  if (email === 'admin@clutchzone.com' && password === 'maxstorm@012') {
    res.status(200).json({
      user: { id: 1, name: 'Admin', email: 'admin@clutchzone.com', role: 'admin' },
      token: 'demo-jwt-token'
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
  res.send("ClutchZone API is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));