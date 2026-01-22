import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    {
      id: user.id || user.dataValues?.id,
      role: user.role,
      accountType: user.accountType,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};


// SIGNUP
export const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user);
    const { password, securityAnswer, ...safeUser } = user.dataValues;

    res.status(201).json({
      message: "Signup successful",
      token,
      user:safeUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    const { password: pwd, securityAnswer, ...safeUser } = user.dataValues;

    res.json({
      message: "Login successful",
      token,
      user:safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY SECURITY ANSWER
export const verifySecurity = async (req, res) => {
  try {
    const { email, securityAnswer } = req.body;
    if (!email || !securityAnswer) {
      return res.status(400).json({ message: "Email and security answer are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
    if (!isMatch)
      return res.status(401).json({ message: "Wrong answer" });

    res.json({ message: "Verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashed }, { where: { email } });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SECURITY QUESTION
export const getSecurityQuestion = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      securityQuestion: user.securityQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

