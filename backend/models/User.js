import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  securityQuestion: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  securityAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
  },

  accountType: {
    type: DataTypes.ENUM("CUSTOMER", "PROVIDER"),
    allowNull: false,
  },
 
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  companyAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Hash password before save (only if not already hashed)
User.beforeCreate(async (user) => {
  // Only hash if password is not already hashed (check if it starts with $2b$)
  if (!user.password.startsWith('$2b$')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  // Only hash if security answer is not already hashed
  if (!user.securityAnswer.startsWith('$2b$')) {
    user.securityAnswer = await bcrypt.hash(user.securityAnswer, 10);
  }
});

export default User;
