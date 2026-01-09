import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name_ar, name_en, parent_id } = req.body;
    const category = await Category.create({ name_ar, name_en, parent_id });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("parent_id");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
