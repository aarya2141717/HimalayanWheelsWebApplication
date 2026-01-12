import express from "express";
import {
  getAllVehicles,
  getProviderVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  toggleAvailability,
} from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getAllVehicles);

// Protected routes (require authentication)
router.get("/my-vehicles", protect, getProviderVehicles);
router.post("/", protect, addVehicle);
router.put("/:id", protect, updateVehicle);
router.delete("/:id", protect, deleteVehicle);
router.patch("/:id/toggle-availability", protect, toggleAvailability);

export default router;
