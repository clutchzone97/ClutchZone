import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  features: [String],
  images: [imageSchema],
  featured: { type: Boolean, default: false },
  status: { type: String, default: 'available' },
}, { timestamps: true });

const Property = mongoose.model("Property", propertySchema);
export default Property;