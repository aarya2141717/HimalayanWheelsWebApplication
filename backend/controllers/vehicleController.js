import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

// Get all vehicles (for customers)
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { available: true },
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "fullName", "companyName"],
        },
      ],
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vehicles by provider
export const getProviderVehicles = async (req, res) => {
  try {
    const providerId = req.user.id; // from auth middleware
    const vehicles = await Vehicle.findAll({
      where: { providerId },
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new vehicle (provider or admin)
export const addVehicle = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { name, type, price, specs, description } = req.body;

    // Allow providers and admins to add vehicles
    const isProvider = req.user.accountType === "PROVIDER";
    const isAdmin = req.user.role === "admin";

    if (!isProvider && !isAdmin) {
      return res.status(403).json({ message: "Only providers or admins can add vehicles" });
    }

    // Handle image upload
    const image = req.file ? `/uploads/vehicles/${req.file.filename}` : null;

    const vehicle = await Vehicle.create({
      name,
      type,
      price,
      specs,
      description,
      image,
      providerId,
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = req.user.id;

    // Allow admin to edit any vehicle
    const vehicle = await Vehicle.findOne({
      where: req.user.role === 'admin' ? { id } : { id, providerId },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found or unauthorized" });
    }

    // Handle image upload if new image is provided
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/vehicles/${req.file.filename}`;
    }

    await vehicle.update(updateData);
    res.json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = req.user.id;

    // Allow admin to delete any vehicle
    const vehicle = await Vehicle.findOne({
      where: req.user.role === 'admin' ? { id } : { id, providerId },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found or unauthorized" });
    }

    await vehicle.destroy();
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle vehicle availability
export const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = req.user.id;

    // Allow admin to toggle any vehicle
    const vehicle = await Vehicle.findOne({
      where: req.user.role === 'admin' ? { id } : { id, providerId },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found or unauthorized" });
    }

    vehicle.available = !vehicle.available;
    await vehicle.save();

    res.json({
      message: "Vehicle availability updated",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
