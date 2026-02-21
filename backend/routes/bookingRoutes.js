import express from "express";
import {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  getAllBookings,
  updateBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStats,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", protect, createBooking);
router.get("/customer", protect, getCustomerBookings);
router.get("/provider", protect, getProviderBookings);
router.get("/all", protect, getAllBookings); // Admin route
router.get("/stats", protect, getBookingStats);
router.put("/:id", protect, updateBooking);
router.patch("/:id/status", protect, updateBookingStatus);
router.delete("/:id", protect, cancelBooking);

export default router;
