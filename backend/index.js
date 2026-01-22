import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { connectDB, sequelize } from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Booking from "./models/Booking.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define model relationships
User.hasMany(Vehicle, { foreignKey: "providerId", as: "vehicles" });
Vehicle.belongsTo(User, { foreignKey: "providerId", as: "provider" });

User.hasMany(Booking, { foreignKey: "customerId", as: "customerBookings" });
User.hasMany(Booking, { foreignKey: "providerId", as: "providerBookings" });
Vehicle.hasMany(Booking, { foreignKey: "vehicleId", as: "bookings" });

Booking.belongsTo(User, { foreignKey: "customerId", as: "customer" });
Booking.belongsTo(User, { foreignKey: "providerId", as: "provider" });
Booking.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicle" });

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);



app.get("/", (req, res) => {
  res.send("Himalayan Wheels Backend Running 🚗");
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await sequelize.sync();
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});
