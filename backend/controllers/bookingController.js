import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

// Create booking (customer)
export const createBooking = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { vehicleId, bookingDate, returnDate, totalCost } = req.body;

    // Check if vehicle exists and is available
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    if (!vehicle.available) {
      return res.status(400).json({ message: "Vehicle is not available" });
    }

    const booking = await Booking.create({
      customerId,
      vehicleId,
      providerId: vehicle.providerId,
      bookingDate,
      returnDate,
      totalCost,
      status: "Pending",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get customer bookings
export const getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user.id;
    const bookings = await Booking.findAll({
      where: { customerId },
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get provider bookings
export const getProviderBookings = async (req, res) => {
  try {
    const providerId = req.user.id;
    const bookings = await Booking.findAll({
      where: { providerId },
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "fullName", "email", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
