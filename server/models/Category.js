import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name_ar: { type: String, required: true },
  name_en: { type: String, required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
