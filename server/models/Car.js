import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  title: String,
  brand: String,
  model: String,
  price: Number,
  year: Number,
  fuel: String,
  transmission: String,
  color: String,
  km: Number,
  description: String,
  images: [String],
  slug: { type: String, unique: true, index: true },
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  display_order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Car", carSchema);
