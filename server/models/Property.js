import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: String,
  type: String,
  purpose: String,
  price: Number,
  area: Number,
  location: String,
  description: String,
  rooms: Number,
  baths: Number,
  features: [String],
  images: [String],
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  display_order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);
