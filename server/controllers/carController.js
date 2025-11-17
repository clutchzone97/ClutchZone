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

  const sortObj = {};
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
