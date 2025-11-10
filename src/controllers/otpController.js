import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import { sendOtpEmail } from "../services/emailServices.js";

// ==============================
// Send OTP Controller
// ==============================
export const sendOtp = async (req, res) => {
  try {
    
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "User already verified." });
    }

    // Delete old OTP if exists (avoid duplicate index errors)
    await Otp.deleteOne({ email });

    // Create new OTP doc
    const otpDoc = new Otp({ email });
    await otpDoc.save();

    const plainOtp = otpDoc.getPlainOtp(); // this is the OTP to send

    // TODO: Send this OTP via email (for now we’ll just log it)
    await sendOtpEmail(email, plainOtp);

    res.status(200).json({
      message: "OTP sent successfully to email.",
      // otp : plainOtp,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error." });
  }
};


// Verify OTP Controller
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record
    const otpRecord = await Otp.findOne({ email});

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found." });
    }

    // Compare OTP with hash
    const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    // Update user's verification status
    await User.updateOne({ email }, { isEmailVerified: true });

    // Delete OTP record
    await Otp.deleteOne({ email });

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error." });
  }
};
