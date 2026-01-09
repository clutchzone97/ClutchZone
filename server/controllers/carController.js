import Car from "../models/Car.js";
import cloudinary from "../config/cloudinary.js";

export const getCars = async (req, res) => {
  const { brand, minPrice, maxPrice, sort, q, featured } = req.query;
  const filter = {};
  if (brand) filter.brand = brand;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (q) filter.model = { $regex: q, $options: "i" };
  if (typeof featured !== 'undefined') filter.featured = String(featured) === 'true';

  const sortObj = { display_order: 1, createdAt: -1 };
  if (sort === "newest") sortObj.createdAt = -1;

  const cars = await Car.find(filter).sort(sortObj);
  res.json(cars);
};

export const getCar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[a-fA-F0-9]{24}$/)) return res.status(400).json({ message: "Invalid id" });
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCar = async (req, res) => {
  const data = req.body;
  const images = Array.isArray(data.images) ? data.images.filter((u) => typeof u === "string" && u.trim()) : [];
  if (images.length < 1 || images.length > 10) {
    return res.status(400).json({ message: "يجب إرفاق بين 1 و 10 صور" });
  }
  data.images = images;
  const car = await Car.create(data);
  res.status(201).json(car);
};

export const updateCar = async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(car);
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
    }).select("title brand model year price imageUrl images");
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
