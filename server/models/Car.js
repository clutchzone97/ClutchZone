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
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Car", carSchema);
