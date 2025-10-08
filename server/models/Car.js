import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  transmission: { type: String, required: true },
  fuel: { type: String, required: true },
  description: { type: String, required: true },
  features: [String],
  images: [imageSchema],
  featured: { type: Boolean, default: false },
  status: { type: String, default: 'available' },
}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);
export default Car;