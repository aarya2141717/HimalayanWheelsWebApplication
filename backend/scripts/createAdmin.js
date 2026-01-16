import { sequelize } from "../db/db.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Admin credentials
    const adminEmail = "admin@himalayanwheels.com";
    const adminPassword = "Admin@123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const hashedSecurityAnswer = await bcrypt.hash("admin", 10);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log("\n   You can login with these credentials.");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      fullName: "System Administrator",
      email: adminEmail,
      phone: "9800000000",
      password: hashedPassword,
      securityQuestion: "What is your favorite food?",
      securityAnswer: hashedSecurityAnswer,
      role: "admin",
      accountType: "CUSTOMER", // Admin can access all features
    });

    console.log("\n✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");
    console.log("\n✅ You can now login with these credentials.\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
