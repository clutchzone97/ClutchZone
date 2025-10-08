import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: Number },
  images: [String],
  description: { type: String },
  features: [String],
  status: { type: String, default: 'available' },
  createdAt: { type: Date, default: Date.now },
});

const Car = mongoose.model("Car", carSchema);
export default Car;