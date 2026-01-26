import express from "express";
import { getProperties, getProperty, createProperty, updateProperty, deleteProperty, searchProperties, reorderProperties, resolvePropertySlug } from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/search", searchProperties);
router.get("/resolve/:id", resolvePropertySlug);
router.post("/reorder", protect, reorderProperties);
router.route("/").get(getProperties).post(protect, createProperty);
router.route("/:id").get(getProperty).put(protect, updateProperty).delete(protect, deleteProperty);

export default router;
