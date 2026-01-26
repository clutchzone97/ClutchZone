import Car from "../models/Car.js";
import cloudinary from "../config/cloudinary.js";
import { createUniqueSlug } from "../utils/slugHelper.js";

export const getCars = async (req, res) => {
  const { brand, minPrice, maxPrice, sort, q, featured } = req.query;
  const filter = {};
  if (brand) filter.brand = brand;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (q) filter.model = { $regex: q, $options: "i" };
  if (typeof featured !== 'undefined') filter.featured = String(featured) === 'true';

  const sortObj = { display_order: 1, createdAt: -1 };
  if (sort === "newest") {
    // Default: Manual order first, then newest
  } else if (sort === "oldest") {
    delete sortObj.display_order;
    sortObj.createdAt = 1;
  } else if (sort === "price_asc") {
    delete sortObj.display_order;
    sortObj.price = 1;
  } else if (sort === "price_desc") {
    delete sortObj.display_order;
    sortObj.price = -1;
  }

  const cars = await Car.find(filter).sort(sortObj);
  res.json(cars);
};

export const getCar = async (req, res) => {
  try {
    const { id } = req.params;
    let car;
    
    // Check if id is a valid MongoDB ObjectId
    if (id.match(/^[a-fA-F0-9]{24}$/)) {
      car = await Car.findById(id);
      // If not found by ID, try slug (edge case where slug is 24 hex chars, unlikely but possible)
      if (!car) {
        car = await Car.findOne({ slug: id });
      }
    } else {
      // It's a slug
      car = await Car.findOne({ slug: id });
    }

    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCar = async (req, res) => {
  try {
    const data = req.body;
    const images = Array.isArray(data.images) ? data.images.filter((u) => typeof u === "string" && u.trim()) : [];
    if (images.length < 1 || images.length > 10) {
      return res.status(400).json({ message: "يجب إرفاق بين 1 و 10 صور" });
    }
    data.images = images;
    
    // Generate unique slug
    data.slug = await createUniqueSlug(Car, data.title || 'car');
    
    const car = await Car.create(data);
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const updateCar = async (req, res) => {
  try {
    const data = req.body;
    // If title is changing, update slug
    if (data.title) {
      data.slug = await createUniqueSlug(Car, data.title, req.params.id);
    }
    
    const car = await Car.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const resolveCarSlug = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[a-fA-F0-9]{24}$/)) return res.status(400).json({ message: "Invalid id" });
    
    const car = await Car.findById(id).select('slug');
    if (!car) return res.status(404).json({ message: "Car not found" });
    
    res.json({ slug: car.slug });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCar = async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const searchCars = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Search query 'q' is required" });
  try {
    const cars = await Car.find({
      $or: [
        { brand: { $regex: q, $options: "i" } },
        { model: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    }).select("title brand model year price imageUrl images display_order").sort({ display_order: 1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const reorderCars = async (req, res) => {
  const { carId, newOrder } = req.body;
  if (!carId || newOrder === undefined || newOrder < 0) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  try {
    await Car.findByIdAndUpdate(carId, { display_order: newOrder });
    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
