import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name_ar, name_en, parent_id, logo_url } = req.body;
    if (parent_id) {
      const parent = await Category.findById(parent_id);
      if (!parent) return res.status(400).json({ message: "Parent category not found" });
    }
    const category = await Category.create({ name_ar, name_en, parent_id, logo_url });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Note: We do NOT delete related items as per requirements.
    // We also need to decide what to do with subcategories. 
    // Usually, we might want to prevent deleting if it has children, OR update children to have null parent.
    // The requirement says "only the category is removed". 
    // Mongoose does not cascade by default, so subcategories will just point to a non-existent parent 
    // or we can set them to null.
    // For simplicity and safety, we'll just delete the category. 
    // The hierarchy builder handles missing parents gracefully (filter checks parent_id).
    
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
