import Property from "../models/Property.js";
import { createUniqueSlug } from "../utils/slugHelper.js";

export const getProperties = async (req, res) => {
  const { type, purpose, minPrice, maxPrice, q, featured, sort } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (purpose) filter.purpose = purpose;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (q) filter.title = { $regex: q, $options: "i" };
  if (typeof featured !== 'undefined') filter.featured = String(featured) === 'true';

  const sortObj = { display_order: 1, createdAt: -1 };
  if (sort === "newest") {
    // Default
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

  const properties = await Property.find(filter).sort(sortObj);
  res.json(properties);
};

export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    let property;
    
    // Check if id is a valid MongoDB ObjectId
    if (id.match(/^[a-fA-F0-9]{24}$/)) {
      property = await Property.findById(id);
      if (!property) {
        property = await Property.findOne({ slug: id });
      }
    } else {
      property = await Property.findOne({ slug: id });
    }

    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createProperty = async (req, res) => {
  try {
    const data = req.body;
    const images = Array.isArray(data.images) ? data.images.filter((u) => typeof u === "string" && u.trim()) : [];
    if (images.length < 1 || images.length > 10) {
      return res.status(400).json({ message: "يجب إرفاق بين 1 و 10 صور" });
    }
    data.images = images;
    
    // Generate unique slug
    data.slug = await createUniqueSlug(Property, data.title || 'property');
    
    const property = await Property.create(data);
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const data = req.body;
    // If title is changing, update slug
    if (data.title) {
      data.slug = await createUniqueSlug(Property, data.title, req.params.id);
    }
    
    const property = await Property.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const resolvePropertySlug = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[a-fA-F0-9]{24}$/)) return res.status(400).json({ message: "Invalid id" });
    
    const property = await Property.findById(id).select('slug');
    if (!property) return res.status(404).json({ message: "Property not found" });
    
    res.json({ slug: property.slug });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProperty = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const searchProperties = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Search query 'q' is required" });
  try {
    const properties = await Property.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    }).select("title type location price imageUrl images display_order").sort({ display_order: 1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const reorderProperties = async (req, res) => {
  const { propertyId, newOrder } = req.body;
  if (!propertyId || newOrder === undefined || newOrder < 0) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  try {
    await Property.findByIdAndUpdate(propertyId, { display_order: newOrder });
    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
