import express from 'express';
import mongoose from 'mongoose';
import Property from '../models/Property.js';
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

// GET all properties
router.get("/", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const properties = await Property.find(req.query).sort({ createdAt: -1 });
      res.status(200).json({properties, total: properties.length});
    } else {
      res.status(200).json({properties: req.app.locals.inMemoryProperties, total: req.app.locals.inMemoryProperties.length});
    }
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

// POST a new property
router.post("/", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const property = new Property(req.body);
      await property.save();
      res.status(201).json(property);
    } else {
      const newProperty = {
        ...req.body,
        _id: new mongoose.Types.ObjectId().toHexString(),
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      req.app.locals.inMemoryProperties.unshift(newProperty);
      res.status(201).json(newProperty);
    }
  } catch (err) {
    console.error("Error adding property:", err);
    res.status(500).json({ message: "Failed to add property" });
  }
});

// GET a specific property by ID
router.get("/:id", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ message: "Property not found" });
      res.status(200).json(property);
    } else {
      const property = req.app.locals.inMemoryProperties.find(p => p._id === req.params.id);
      if (!property) return res.status(404).json({ message: "Property not found" });
      res.status(200).json(property);
    }
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(500).json({ message: "Failed to fetch property" });
  }
});

// UPDATE a property by ID
router.put("/:id", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!property) return res.status(404).json({ message: "Property not found" });
      res.status(200).json(property);
    } else {
      const index = req.app.locals.inMemoryProperties.findIndex(p => p._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: "Property not found" });
      req.app.locals.inMemoryProperties[index] = { ...req.app.locals.inMemoryProperties[index], ...req.body };
      res.status(200).json(req.app.locals.inMemoryProperties[index]);
    }
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ message: "Failed to update property" });
  }
});

// DELETE a property by ID
router.delete("/:id", async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ message: "Property not found" });
      if (property.images && property.images.length > 0) {
        await Promise.all(property.images.map(img => deleteImage(img.public_id)));
      }
      await Property.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Property deleted successfully" });
    } else {
      const index = req.app.locals.inMemoryProperties.findIndex(p => p._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: "Property not found" });
      req.app.locals.inMemoryProperties.splice(index, 1);
      res.status(200).json({ message: "Property deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ message: "Failed to delete property" });
  }
});

// POST property images
router.post('/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    let uploadedImages = [];
    if (req.app.locals.isMongoConnected) {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ message: 'Property not found' });

      uploadedImages = await Promise.all(req.files.map(async (file) => {
        const result = await uploadImage(file.path);
        fs.unlinkSync(file.path); // Clean up local file
        return { url: result.secure_url, public_id: result.public_id };
      }));

      property.images.push(...uploadedImages);
      await property.save();
      res.status(200).json({ images: property.images, message: 'Images uploaded successfully' });
    } else {
      // In-memory fallback
      const property = req.app.locals.inMemoryProperties.find(p => p._id === req.params.id);
      if (!property) return res.status(404).json({ message: 'Property not found' });

      uploadedImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename
      }));

      if (!property.images) property.images = [];
      property.images.push(...uploadedImages);
      res.status(200).json({ images: property.images, message: 'Images uploaded successfully (in-memory)' });
    }
  } catch (error) {
    console.error('Error uploading property images:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

export default router;