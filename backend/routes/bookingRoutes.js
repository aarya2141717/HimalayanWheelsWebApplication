import express from "express";
import {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", protect, createBooking);
router.get("/customer", protect, getCustomerBookings);
router.get("/provider", protect, getProviderBookings);
router.patch("/:id/status", protect, updateBookingStatus);

export default router;
