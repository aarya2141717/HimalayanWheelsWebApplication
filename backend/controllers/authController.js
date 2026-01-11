import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      role: user.role,
      accountType: user.accountType 
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

    res.status(201).json({
      message: "Signup successful",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY SECURITY ANSWER
export const verifySecurity = async (req, res) => {
  const { email, securityAnswer } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
  if (!isMatch)
    return res.status(401).json({ message: "Wrong answer" });

  res.json({ message: "Verified" });
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashed }, { where: { email } });

  res.json({ message: "Password reset successful" });
};
