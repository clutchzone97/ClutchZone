import express from 'express';
import mongoose from 'mongoose';
import Car from '../models/Car.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// GET all cars
router.get("/", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const cars = await Car.find(req.query).sort({ createdAt: -1 });
      res.status(200).json({cars, total: cars.length});
    } else {
      res.status(200).json({cars: req.app.locals.inMemoryCars, total: req.app.locals.inMemoryCars.length});
    }
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ message: "Failed to fetch cars" });
  }
});

// POST a new car
router.post("/", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const car = new Car(req.body);
      await car.save();
      res.status(201).json(car);
    } else {
      const newCar = {
        ...req.body,
        _id: new mongoose.Types.ObjectId().toHexString(),
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      req.app.locals.inMemoryCars.unshift(newCar);
      res.status(201).json(newCar);
    }
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).json({ message: "Failed to add car" });
  }
});

// GET a specific car by ID
router.get("/:id", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const car = await Car.findById(req.params.id);
      if (!car) return res.status(404).json({ message: "Car not found" });
      res.status(200).json(car);
    } else {
      const car = req.app.locals.inMemoryCars.find(c => c._id === req.params.id);
      if (!car) return res.status(404).json({ message: "Car not found" });
      res.status(200).json(car);
    }
  } catch (err) {
    console.error("Error fetching car:", err);
    res.status(500).json({ message: "Failed to fetch car" });
  }
});

// UPDATE a car by ID
router.put("/:id", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!car) return res.status(404).json({ message: "Car not found" });
      res.status(200).json(car);
    } else {
      const index = req.app.locals.inMemoryCars.findIndex(c => c._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: "Car not found" });
      req.app.locals.inMemoryCars[index] = { ...req.app.locals.inMemoryCars[index], ...req.body };
      res.status(200).json(req.app.locals.inMemoryCars[index]);
    }
  } catch (err) {
    console.error("Error updating car:", err);
    res.status(500).json({ message: "Failed to update car" });
  }
});

// DELETE a car by ID
router.delete("/:id", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const car = await Car.findById(req.params.id);
      if (!car) return res.status(404).json({ message: "Car not found" });
      if (car.images && car.images.length > 0) {
        await Promise.all(car.images.map(img => deleteImage(img.public_id)));
      }
      await Car.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Car deleted successfully" });
    } else {
      const index = req.app.locals.inMemoryCars.findIndex(c => c._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: "Car not found" });
      req.app.locals.inMemoryCars.splice(index, 1);
      res.status(200).json({ message: "Car deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting car:", err);
    res.status(500).json({ message: "Failed to delete car" });
  }
});

// POST car images
router.post('/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    let uploadedImages = [];
    if (req.app.locals.isMongoConnected) {
      const car = await Car.findById(req.params.id);
      if (!car) return res.status(404).json({ message: 'Car not found' });

      uploadedImages = await Promise.all(req.files.map(async (file) => {
        const result = await uploadImage(file.path);
        fs.unlinkSync(file.path); // Clean up local file
        return { url: result.secure_url, public_id: result.public_id };
      }));

      car.images.push(...uploadedImages);
      await car.save();
      res.status(200).json({ images: car.images, message: 'Images uploaded successfully' });

    } else {
      // In-memory fallback
      const car = req.app.locals.inMemoryCars.find(c => c._id === req.params.id);
      if (!car) return res.status(404).json({ message: 'Car not found' });

      uploadedImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename
      }));

      if (!car.images) car.images = [];
      car.images.push(...uploadedImages);
      res.status(200).json({ images: car.images, message: 'Images uploaded successfully (in-memory)' });
    }
  } catch (error) {
    console.error('Error uploading car images:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

export default router;