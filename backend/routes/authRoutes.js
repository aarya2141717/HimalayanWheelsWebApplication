import express from "express";
import {
  signup,
  login,
  verifySecurity,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-security", verifySecurity);
router.post("/reset-password", resetPassword);

export default router;
