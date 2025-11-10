import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";

const router = express.Router();

// 🔹 Route to send OTP to user’s email
router.post("/send", sendOtp);

// 🔹 Route to verify OTP
router.post("/verify", verifyOtp);

export default router;
