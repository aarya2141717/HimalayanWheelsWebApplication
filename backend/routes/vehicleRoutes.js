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
import { upload } from "../middleware/multerConfig.js";

const router = express.Router();

// Public route
router.get("/", getAllVehicles);

// Protected routes (require authentication)
router.get("/my-vehicles", protect, getProviderVehicles);
router.post("/", protect, upload.single("image"), addVehicle);
router.put("/:id", protect, upload.single("image"), updateVehicle);
router.delete("/:id", protect, deleteVehicle);
router.patch("/:id/toggle-availability", protect, toggleAvailability);

export default router;
