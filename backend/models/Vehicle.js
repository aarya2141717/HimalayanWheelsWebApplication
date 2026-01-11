import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const Vehicle = sequelize.define("Vehicle", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  type: {
    type: DataTypes.ENUM("Bike", "Scooter", "Car", "SUV"),
    allowNull: false,
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  specs: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  providerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },

  totalBookings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  revenue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
});

export default Vehicle;
