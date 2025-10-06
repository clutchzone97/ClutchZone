import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  area: { type: Number },
  images: [String],
  category: {
    type: String,
    enum: ["apartment", "villa", "store", "land", "office"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Property = mongoose.model("Property", propertySchema);
export default Property;