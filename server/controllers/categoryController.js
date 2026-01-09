import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name_ar, name_en, parent_id } = req.body;
    if (parent_id) {
      const parent = await Category.findById(parent_id);
      if (!parent) return res.status(400).json({ message: "Parent category not found" });
    }
    const category = await Category.create({ name_ar, name_en, parent_id });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    
    const buildHierarchy = (items, parentId = null) => {
      return items
        .filter(item => String(item.parent_id || '') === String(parentId || ''))
        .map(item => ({
          ...item,
          children: buildHierarchy(items, item._id)
        }));
    };

    const hierarchy = buildHierarchy(categories, null);
    res.json(hierarchy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
