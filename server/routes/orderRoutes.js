import express from "express";
import { createOrder, getOrders, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(createOrder).get(protect, getOrders);
router.route("/:id/status").put(protect, updateOrderStatus);
router.route("/:id").delete(protect, deleteOrder);

export default router;
