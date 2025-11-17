import Property from "../models/Property.js";

export const getProperties = async (req, res) => {
  const { type, purpose, minPrice, maxPrice, q, featured } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (purpose) filter.purpose = purpose;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (q) filter.title = { $regex: q, $options: "i" };
  if (typeof featured !== 'undefined') filter.featured = String(featured) === 'true';

  const properties = await Property.find(filter).sort({ createdAt: -1 });
  res.json(properties);
};

export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[a-fA-F0-9]{24}$/)) return res.status(400).json({ message: "Invalid id" });
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createProperty = async (req, res) => {
  const data = req.body;
  const images = Array.isArray(data.images) ? data.images.filter((u) => typeof u === "string" && u.trim()) : [];
  if (images.length < 1 || images.length > 10) {
    return res.status(400).json({ message: "يجب إرفاق بين 1 و 10 صور" });
  }
  data.images = images;
  const property = await Property.create(data);
  res.status(201).json(property);
};

export const updateProperty = async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(property);
};

export const deleteProperty = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
