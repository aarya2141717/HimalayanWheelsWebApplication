import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },

  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Vehicles",
      key: "id",
    },
  },

  providerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },

  bookingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("Pending", "Confirmed", "Active", "Completed", "Cancelled"),
    defaultValue: "Pending",
  },

  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

export default Booking;
