import express from "express";
import { getProperties, getProperty, createProperty, updateProperty, deleteProperty } from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(getProperties).post(protect, createProperty);
router.route("/:id").get(getProperty).put(protect, updateProperty).delete(protect, deleteProperty);

export default router;
