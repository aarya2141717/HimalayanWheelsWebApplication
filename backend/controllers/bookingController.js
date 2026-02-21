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

    // Fetch booking with vehicle details
    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
      ],
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: bookingWithDetails,
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

// Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
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
        {
          model: User,
          as: "provider",
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

// Update booking (edit dates)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingDate, returnDate, totalCost } = req.body;
    const customerId = req.user.id;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking
    if (booking.customerId !== customerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to update this booking" });
    }

    // Update booking
    booking.bookingDate = bookingDate || booking.bookingDate;
    booking.returnDate = returnDate || booking.returnDate;
    booking.totalCost = totalCost || booking.totalCost;
    await booking.save();

    // Fetch updated booking with details
    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
      ],
    });

    res.json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

    // Fetch updated booking with details
    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
      ],
    });

    res.json({
      message: "Booking status updated",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking
    if (booking.customerId !== customerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    // Update status to Cancelled
    booking.status = "Cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const accountType = req.user.accountType;

    let whereClause = {};
    
    if (userRole === 'admin') {
      // Admin can see all stats
      whereClause = {};
    } else if (accountType === 'PROVIDER') {
      // Provider sees their vehicles' bookings
      whereClause = { providerId: userId };
    } else {
      // Customer sees their bookings
      whereClause = { customerId: userId };
    }

    const totalBookings = await Booking.count({ where: whereClause });
    // Treat both Pending and Confirmed as active
    const activeBookings = await Booking.count({ 
      where: { 
        ...whereClause, 
        status: ['Pending', 'Confirmed']
      } 
    });
    const pendingBookings = await Booking.count({ 
      where: { ...whereClause, status: 'Pending' } 
    });
    const cancelledBookings = await Booking.count({ 
      where: { ...whereClause, status: 'Cancelled' } 
    });

    // Calculate total revenue
    const bookings = await Booking.findAll({ 
      where: whereClause,
      attributes: ['totalCost']
    });
    const totalRevenue = bookings.reduce((sum, booking) => sum + (parseFloat(booking.totalCost) || 0), 0);

    res.json({
      totalBookings,
      activeBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
