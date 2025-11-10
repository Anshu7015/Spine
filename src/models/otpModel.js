import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otpHash: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
});

// 🔹 Pre-save hook: Generate + hash OTP
otpSchema.pre("save", async function (next) {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP
  this.otpHash = await bcrypt.hash(otp, 10);

  // Set expiry (e.g., 5 minutes)
  this.expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Keep plain OTP temporarily (not saved in DB)
  this._plainOtp = otp;

  next();
});

// 🔹 Helper method to get the plain OTP (for sending email)
otpSchema.methods.getPlainOtp = function () {
  return this._plainOtp;
};

// TTL index (auto delete expired OTP)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Unique index to prevent multiple OTPs per user per purpose
otpSchema.index({ email: 1, purpose: 1 }, { unique: true });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;