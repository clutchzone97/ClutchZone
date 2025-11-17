import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  message: String,
  productType: { type: String, enum: ["car", "property"] },
  productId: String,
  priceAtOrder: Number,
  status: { type: String, default: "جديد" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
