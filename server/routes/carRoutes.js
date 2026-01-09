import express from "express";
import { getCars, getCar, createCar, updateCar, deleteCar, searchCars, reorderCars } from "../controllers/carController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/search", searchCars);
router.post("/reorder", protect, reorderCars);
router.route("/").get(getCars).post(protect, createCar);
router.route("/:id").get(getCar).put(protect, updateCar).delete(protect, deleteCar);

export default router;
