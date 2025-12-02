import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const adminSchema = new mongoose.Schema({
    adminName : {type : String,default : "SPINE_Admin"},
    adminEmail : {type : String, required : true},
    adminPassword : {type : String, required : true},
    accessToken : {type : String},
    refreshToken : {type : String}
});

//Pre-save hook to hash password
adminSchema.pre("save", async function (next) {
  //If adminPassword is not modified, just skip it don't hash it again.
  if (!this.isModified("adminPassword")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

//Method to compare password(to be implemented with bcrypt).
//Used for login time.
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.adminPassword);
};

//JWT (Generate and Refresh Token)

adminSchema.methods.generateAccessToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id, email: this.email, name: this.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    return token;
  } catch (error) {
    throw new Error("Failed to generate access token");
  }
};

adminSchema.methods.generateRefreshToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
    return token;
  } catch (error) {
    throw new Error("Failed to generate refresh token");
  }
};


export default mongoose.model("Admin",adminSchema);